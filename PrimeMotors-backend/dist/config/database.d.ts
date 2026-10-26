import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
declare const prisma: PrismaClient<{
    adapter: PrismaMariaDb;
}, never, import("@prisma/client/runtime/client").DefaultArgs>;
export default prisma;
