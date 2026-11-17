import prisma from "../config/database";
import {
  publishProposalCreated,
  trimProposalEventStream,
} from "./proposalEvents";
import { logger } from "../utils/logger";

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
      logger.error("proposal.outbox.lease_expired_after_publish", {
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
    logger.error("proposal.outbox.retry_scheduled", {
      eventId: candidate.id,
      retryDelayMs,
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
    logger.error("proposal.outbox.stream_retention_cleanup_failed", { error });
  }

  let result: { count: number };
  try {
    result = await prisma.proposalOutbox.deleteMany({
      where: { publishedAt: { lt: retentionCutoff } },
    });
  } catch (error) {
    logger.error("proposal.outbox.retention_cleanup_failed", { error });
    return;
  }

  cleanupDueAt = Date.now() + 60 * 60 * 1_000;
  if (result.count > 0) {
    logger.info("proposal.outbox.expired_records_removed", {
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
    logger.error("proposal.outbox.dispatch_cycle_failed", { error });
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
  logger.info("proposal.outbox.dispatcher_started", {
    intervalMs: DISPATCH_INTERVAL_MS,
    maxEventsPerCycle: MAX_EVENTS_PER_CYCLE,
  });

  return async function stopProposalOutboxDispatcher() {
    stopped = true;
    clearInterval(timer);
    if (activeCycle) await activeCycle;
    logger.info("proposal.outbox.dispatcher_stopped");
  };
}
