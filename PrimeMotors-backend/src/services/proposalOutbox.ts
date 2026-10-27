import prisma from "../config/database";
import {
  publishProposalCreated,
  trimProposalEventStream,
} from "./proposalEvents";

const DISPATCH_INTERVAL_MS = 1_000;
const LOCK_DURATION_MS = 60_000;
const MAX_EVENTS_PER_CYCLE = 25;
const PUBLISHED_RETENTION_DAYS = 30;

let activeCycle: Promise<void> | null = null;
let cleanupDueAt = 0;

async function dispatchNextEvent() {
  const now = new Date();
  const candidate = await prisma.proposalOutbox.findFirst({
    where: {
      publishedAt: null,
      nextAttemptAt: { lte: now },
      OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }],
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, proposalId: true, createdAt: true, attempts: true },
  });

  if (!candidate) return false;

  const lockedUntil = new Date(now.getTime() + LOCK_DURATION_MS);
  const claim = await prisma.proposalOutbox.updateMany({
    where: {
      id: candidate.id,
      publishedAt: null,
      nextAttemptAt: { lte: now },
      OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }],
    },
    data: { lockedUntil, attempts: { increment: 1 } },
  });

  if (claim.count !== 1) return true;

  try {
    await publishProposalCreated({
      eventId: candidate.id,
      proposalId: candidate.proposalId,
      occurredAt: candidate.createdAt.toISOString(),
    });

    const published = await prisma.proposalOutbox.updateMany({
      where: { id: candidate.id, lockedUntil },
      data: { publishedAt: new Date(), lockedUntil: null },
    });

    if (published.count !== 1) {
      console.error("Proposal event was published after its outbox lease expired", {
        eventId: candidate.id,
      });
    }
  } catch (error) {
    const retryDelayMs = Math.min(
      1_000 * 2 ** Math.min(candidate.attempts, 10),
      15 * 60 * 1_000,
    );
    await prisma.proposalOutbox.updateMany({
      where: { id: candidate.id, lockedUntil },
      data: {
        lockedUntil: null,
        nextAttemptAt: new Date(Date.now() + retryDelayMs),
      },
    });
    console.error("Proposal outbox dispatch failed; retry scheduled", {
      eventId: candidate.id,
      error,
    });
  }

  return true;
}

async function cleanupPublishedEvents() {
  const now = Date.now();
  if (now < cleanupDueAt) return;
  cleanupDueAt = now + 60 * 1_000;

  const retentionCutoff = new Date(
    now - PUBLISHED_RETENTION_DAYS * 24 * 60 * 60 * 1_000,
  );
  try {
    await trimProposalEventStream();
  } catch (error) {
    console.error("Proposal Redis Stream retention cleanup failed", error);
  }

  let result: { count: number };
  try {
    result = await prisma.proposalOutbox.deleteMany({
      where: { publishedAt: { lt: retentionCutoff } },
    });
  } catch (error) {
    console.error("Proposal outbox retention cleanup failed", error);
    return;
  }

  cleanupDueAt = Date.now() + 60 * 60 * 1_000;
  if (result.count > 0) {
    console.info("Expired published proposal outbox records removed", {
      count: result.count,
    });
  }
}

async function runCycle() {
  if (activeCycle) return activeCycle;

  activeCycle = (async () => {
    await cleanupPublishedEvents();
    for (let index = 0; index < MAX_EVENTS_PER_CYCLE; index += 1) {
      if (!(await dispatchNextEvent())) break;
    }
  })();

  try {
    await activeCycle;
  } catch (error) {
    console.error("Proposal outbox dispatcher cycle failed", error);
  } finally {
    activeCycle = null;
  }
}

export function startProposalOutboxDispatcher() {
  let stopped = false;
  const timer = setInterval(() => {
    if (!stopped) void runCycle();
  }, DISPATCH_INTERVAL_MS);

  void runCycle();

  return async function stopProposalOutboxDispatcher() {
    stopped = true;
    clearInterval(timer);
    if (activeCycle) await activeCycle;
  };
}
