import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import os from "os";

// Prisma SQLite workaround for Vercel serverless environments
if (process.env.VERCEL || (process.env.NODE_ENV === "production" && os.platform() !== "win32")) {
  const dbName = "dev.db";
  const sourceDbPath = path.join(process.cwd(), "prisma", dbName);
  const destDbPath = path.join("/tmp", dbName);

  try {
    if (fs.existsSync(sourceDbPath)) {
      if (!fs.existsSync(destDbPath)) {
        fs.copyFileSync(sourceDbPath, destDbPath);
        console.log(`Database successfully copied to ${destDbPath}`);
      }
    } else {
      console.error(`Source database not found at ${sourceDbPath}`);
    }
  } catch (e) {
    console.error("Failed to copy database to /tmp:", e);
  }

  // Override the environment variable so Prisma connects to the writeable /tmp path
  process.env.DATABASE_URL = `file:${destDbPath}`;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
