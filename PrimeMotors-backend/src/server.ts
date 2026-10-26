import prisma from "./config/database";
import { redisClient } from "./config/redis";
import { startProposalEventSubscriber } from "./services/proposalEvents";
import app from './app';

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  await redisClient.connect();
  const proposalSubscriber = await startProposalEventSubscriber();
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor online na porta ${port}`);
  });

  const shutdown = (signal: NodeJS.Signals) => {
    console.log(`Recebido ${signal}; encerrando servidor.`);
    server.close((error) => {
      void (async () => {
        try {
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
        } catch (shutdownError) {
          console.error("Falha ao encerrar conexões:", shutdownError);
          process.exitCode = 1;
        }
      })();
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

void startServer().catch(async (error) => {
  console.error("Falha ao iniciar o servidor:", error);
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  await prisma.$disconnect();
  process.exitCode = 1;
});