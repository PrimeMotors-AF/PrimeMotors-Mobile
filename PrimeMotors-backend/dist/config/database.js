"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const client_1 = require("@prisma/client");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL não está definida no ambiente.");
}
const connectionUrl = new URL(databaseUrl);
if (connectionUrl.protocol === "mysql:") {
    connectionUrl.protocol = "mariadb:";
}
else if (connectionUrl.protocol !== "mariadb:") {
    throw new Error("DATABASE_URL deve usar o protocolo mysql:// ou mariadb://.");
}
if (["localhost", "127.0.0.1", "::1"].includes(connectionUrl.hostname)) {
    connectionUrl.searchParams.set("allowPublicKeyRetrieval", "true");
}
const adapter = new adapter_mariadb_1.PrismaMariaDb(connectionUrl.toString());
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
//# sourceMappingURL=database.js.map