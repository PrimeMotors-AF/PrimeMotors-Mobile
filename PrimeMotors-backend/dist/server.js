"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
const redis_1 = require("./config/redis");
const proposalEvents_1 = require("./services/proposalEvents");
const proposalOutbox_1 = require("./services/proposalOutbox");
const app_1 = __importDefault(require("./app"));
const port = Number(process.env.PORT) || 3000;
async function startServer() {
    await redis_1.redisClient.connect();
    const proposalSubscriber = await (0, proposalEvents_1.startProposalEventSubscriber)();
    const stopProposalOutboxDispatcher = (0, proposalOutbox_1.startProposalOutboxDispatcher)();
    const server = app_1.default.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Servidor online na porta ${port}`);
    });
    const shutdown = (signal) => {
        console.log(`Recebido ${signal}; encerrando servidor.`);
        server.close((error) => {
            void (async () => {
                try {
                    await stopProposalOutboxDispatcher();
                    if (redis_1.redisClient.isOpen) {
                        await redis_1.redisClient.quit();
                    }
                    if (proposalSubscriber.isOpen) {
                        await proposalSubscriber.quit();
                    }
                    await database_1.default.$disconnect();
                    if (error) {
                        throw error;
                    }
                }
                catch (shutdownError) {
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
    if (redis_1.redisClient.isOpen) {
        await redis_1.redisClient.quit();
    }
    await database_1.default.$disconnect();
    process.exitCode = 1;
});
//# sourceMappingURL=server.js.map