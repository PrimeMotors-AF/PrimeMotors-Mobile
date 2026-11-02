"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startProposalOutboxDispatcher = startProposalOutboxDispatcher;
const database_1 = __importDefault(require("../config/database"));
const proposalEvents_1 = require("./proposalEvents");
const DISPATCH_INTERVAL_MS = 1_000;
const LOCK_DURATION_MS = 60_000;
const MAX_EVENTS_PER_CYCLE = 25;
const PUBLISHED_RETENTION_DAYS = 30;
let activeCycle = null;
let cleanupDueAt = 0;
async function dispatchNextEvent() {
    const now = new Date();
    const candidate = await database_1.default.proposalOutbox.findFirst({
        where: {
            publishedAt: null,
            nextAttemptAt: { lte: now },
            OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }],
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, proposalId: true, createdAt: true, attempts: true },
    });
    if (!candidate)
        return false;
    const lockedUntil = new Date(now.getTime() + LOCK_DURATION_MS);
    const claim = await database_1.default.proposalOutbox.updateMany({
        where: {
            id: candidate.id,
            publishedAt: null,
            nextAttemptAt: { lte: now },
            OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }],
        },
        data: { lockedUntil, attempts: { increment: 1 } },
    });
    if (claim.count !== 1)
        return true;
    try {
        await (0, proposalEvents_1.publishProposalCreated)({
            eventId: candidate.id,
            proposalId: candidate.proposalId,
            occurredAt: candidate.createdAt.toISOString(),
        });
        const published = await database_1.default.proposalOutbox.updateMany({
            where: { id: candidate.id, lockedUntil },
            data: { publishedAt: new Date(), lockedUntil: null },
        });
        if (published.count !== 1) {
            console.error("Proposal event was published after its outbox lease expired", {
                eventId: candidate.id,
            });
        }
    }
    catch (error) {
        const retryDelayMs = Math.min(1_000 * 2 ** Math.min(candidate.attempts, 10), 15 * 60 * 1_000);
        await database_1.default.proposalOutbox.updateMany({
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
    if (now < cleanupDueAt)
        return;
    cleanupDueAt = now + 60 * 1_000;
    const retentionCutoff = new Date(now - PUBLISHED_RETENTION_DAYS * 24 * 60 * 60 * 1_000);
    try {
        await (0, proposalEvents_1.trimProposalEventStream)();
    }
    catch (error) {
        console.error("Proposal Redis Stream retention cleanup failed", error);
    }
    let result;
    try {
        result = await database_1.default.proposalOutbox.deleteMany({
            where: { publishedAt: { lt: retentionCutoff } },
        });
    }
    catch (error) {
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
    if (activeCycle)
        return activeCycle;
    activeCycle = (async () => {
        await cleanupPublishedEvents();
        for (let index = 0; index < MAX_EVENTS_PER_CYCLE; index += 1) {
            if (!(await dispatchNextEvent()))
                break;
        }
    })();
    try {
        await activeCycle;
    }
    catch (error) {
        console.error("Proposal outbox dispatcher cycle failed", error);
    }
    finally {
        activeCycle = null;
    }
}
function startProposalOutboxDispatcher() {
    let stopped = false;
    const timer = setInterval(() => {
        if (!stopped)
            void runCycle();
    }, DISPATCH_INTERVAL_MS);
    void runCycle();
    return async function stopProposalOutboxDispatcher() {
        stopped = true;
        clearInterval(timer);
        if (activeCycle)
            await activeCycle;
    };
}
//# sourceMappingURL=proposalOutbox.js.map