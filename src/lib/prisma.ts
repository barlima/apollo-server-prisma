import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { config } from "../config";

const adapter = new PrismaPg({ connectionString: config.databaseUrl });
const prisma = new PrismaClient({
  adapter,
  log: config.isDevelopment ? ["query", "info", "warn", "error"] : ["error"],
});

export { prisma };
