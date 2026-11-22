import prisma from "./config/database";
import { redisClient } from "./config/redis";
import { startProposalEventSubscriber } from "./services/proposalEvents";
import { startProposalOutboxDispatcher } from "./services/proposalOutbox";
import app from './app';
import { logger } from "./utils/logger";

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  await redisClient.connect();
  await prisma.$queryRaw`SELECT 1`;
  logger.info("dependency.database.ready");

  const proposalSubscriber = await startProposalEventSubscriber();
  const stopProposalOutboxDispatcher = startProposalOutboxDispatcher();
  logger.info("server.proposal_outbox_started");
  const server = app.listen(port, '0.0.0.0', () => {
    logger.info("server.listening", { port });
  });

  const shutdown = (signal: NodeJS.Signals) => {
    logger.info("server.shutdown_started", { signal });
    server.close((error) => {
      void (async () => {
        try {
          await stopProposalOutboxDispatcher();
          if (redisClient.isOpen) {
            await redisClient.quit();
          }
          if (proposalSubscriber.isOpen) {
            await proposalSubscriber.quit();
          }
          await prisma.$disconnect();
          if (error) {
            throw error;
          }
          logger.info("server.shutdown_completed");
        } catch (shutdownError) {
          logger.error("server.shutdown_failed", { error: shutdownError });
          process.exitCode = 1;
        }
      })();
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

void startServer().catch(async (error) => {
  logger.error("server.startup_failed", { error });
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  await prisma.$disconnect();
  process.exitCode = 1;
});