// Système d'authentification admin simple

import crypto from 'crypto';

// En production, utilisez bcrypt et stockez dans une base de données
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

/**
 * Vérifie le mot de passe admin
 */
export function verifyAdminPassword(password: string): boolean {
  if (!ADMIN_PASSWORD_HASH) {
    // Mode développement : mot de passe par défaut
    return password === 'admin123';
  }
  
  // En production, utiliser bcrypt
  // return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
  return password === process.env.ADMIN_PASSWORD;
}

/**
 * Génère un token de session admin
 */
export function generateAdminToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Stockage temporaire des sessions admin (en production, utilisez Redis ou une DB)
const adminSessions = new Map<string, { expiresAt: number }>();

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures

/**
 * Crée une session admin
 */
export function createAdminSession(): string {
  const token = generateAdminToken();
  const expiresAt = Date.now() + SESSION_DURATION;
  
  adminSessions.set(token, { expiresAt });
  
  // Nettoyer les sessions expirées
  setTimeout(() => {
    adminSessions.delete(token);
  }, SESSION_DURATION);
  
  return token;
}

/**
 * Vérifie si un token admin est valide
 */
export function verifyAdminSession(token: string): boolean {
  const session = adminSessions.get(token);
  
  if (!session) {
    return false;
  }
  
  if (Date.now() > session.expiresAt) {
    adminSessions.delete(token);
    return false;
  }
  
  return true;
}

/**
 * Supprime une session admin
 */
export function deleteAdminSession(token: string): void {
  adminSessions.delete(token);
}
