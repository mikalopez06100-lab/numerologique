// Système d'authentification par email avec magic link

import crypto from 'crypto';
import { 
  hasUserAlreadyAnalyzed as checkUserAnalyzed, 
  getOrCreateUser as getOrCreateUserFirebase 
} from './firebase-db';

const TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes

/**
 * Génère un token unique pour l'authentification par email
 */
export function generateAuthToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Vérifie si un email a déjà fait une analyse
 */
export async function hasUserAlreadyAnalyzed(email: string): Promise<boolean> {
  return await checkUserAnalyzed(email);
}

/**
 * Crée ou récupère un utilisateur par email
 */
export async function getOrCreateUser(email: string) {
  return await getOrCreateUserFirebase(email);
}

/**
 * Stocke un token d'authentification temporaire
 * (En production, utilisez Redis ou une base de données dédiée)
 */
const authTokens = new Map<string, { email: string; expiresAt: number }>();

/**
 * Crée un token d'authentification pour un email
 */
export function createAuthToken(email: string): string {
  const token = generateAuthToken();
  const expiresAt = Date.now() + TOKEN_EXPIRY;

  authTokens.set(token, { email, expiresAt });

  // Nettoyer les tokens expirés
  setTimeout(() => {
    authTokens.delete(token);
  }, TOKEN_EXPIRY);

  return token;
}

/**
 * Vérifie et valide un token d'authentification
 */
export function verifyAuthToken(token: string): string | null {
  const tokenData = authTokens.get(token);

  if (!tokenData) {
    return null;
  }

  if (Date.now() > tokenData.expiresAt) {
    authTokens.delete(token);
    return null;
  }

  return tokenData.email;
}

/**
 * Supprime un token après utilisation
 */
export function deleteAuthToken(token: string): void {
  authTokens.delete(token);
}
