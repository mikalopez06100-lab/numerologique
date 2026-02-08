import { NextResponse } from 'next/server';
import { getRateLimitStats } from '@/lib/rateLimiter';

/**
 * Route pour obtenir les statistiques de limitation d'utilisation
 * Accès: GET /api/rate-limit
 */
export async function GET() {
  const rateLimitConfig = {
    maxCallsPerDay: parseInt(process.env.RATE_LIMIT_DAILY || '50'),
    maxCallsPerHour: parseInt(process.env.RATE_LIMIT_HOURLY || '10'),
    maxCallsPerMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '3'),
  };
  
  const stats = getRateLimitStats(rateLimitConfig);
  
  return NextResponse.json({
    success: true,
    config: rateLimitConfig,
    ...stats,
  });
}
