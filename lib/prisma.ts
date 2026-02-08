import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  sqlite: Database.Database | undefined;
};

// Fonction pour obtenir le chemin de la base de données depuis DATABASE_URL
function getDatabasePath(): string {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return './dev.db';
  }
  // Enlever le préfixe "file:" si présent
  return dbUrl.replace(/^file:/, '');
}

// Créer l'instance de better-sqlite3 (singleton)
const sqlite =
  globalForPrisma.sqlite ??
  new Database(getDatabasePath());

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.sqlite = sqlite;
}

// Créer l'adaptateur
const adapter = new PrismaBetterSqlite3(sqlite);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
