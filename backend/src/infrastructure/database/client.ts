import { PrismaClient, Prisma } from "../../../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { getLogger } from "../../core/logging/logger.js";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString }); // ✅ required in Prisma v7 client engine :contentReference[oaicite:1]{index=1}

  return new PrismaClient({
    adapter,
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
    ],
  });
}

type PrismaWithEvents = ReturnType<typeof createPrismaClient>;

class DatabaseClient {
  private static instance: PrismaWithEvents | undefined;

  static getInstance(): PrismaWithEvents {
    if (!DatabaseClient.instance) {
      const logger = getLogger().child({ context: "DatabaseClient" });

      DatabaseClient.instance = createPrismaClient();

      if (process.env.NODE_ENV === "development") {
        DatabaseClient.instance.$on("query", (e: Prisma.QueryEvent) => {
          logger.debug("Database query", { query: e.query, duration: e.duration });
        });
      }

      DatabaseClient.instance.$on("error", (e: Prisma.LogEvent) => {
        logger.error("Database error", { error: e });
      });
    }

    return DatabaseClient.instance;
  }

  static async disconnect() {
    if (DatabaseClient.instance) await DatabaseClient.instance.$disconnect();
  }
}

export const prisma = DatabaseClient.getInstance();
