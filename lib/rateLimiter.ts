// Système de limitation d'utilisation pour contrôler les appels OpenAI

interface RateLimitConfig {
  maxCallsPerDay: number;
  maxCallsPerHour: number;
  maxCallsPerMinute: number;
}

interface RateLimitData {
  daily: {
    count: number;
    resetDate: string; // ISO date
  };
  hourly: {
    count: number;
    resetTime: number; // timestamp
  };
  perMinute: {
    count: number;
    resetTime: number; // timestamp
  };
}

// Configuration par défaut
const DEFAULT_CONFIG: RateLimitConfig = {
  maxCallsPerDay: 50, // Limite par jour
  maxCallsPerHour: 10, // Limite par heure
  maxCallsPerMinute: 3, // Limite par minute
};

// Stockage en mémoire (pourrait être remplacé par une base de données)
let rateLimitData: RateLimitData = {
  daily: {
    count: 0,
    resetDate: new Date().toISOString().split('T')[0], // Date du jour
  },
  hourly: {
    count: 0,
    resetTime: Date.now() + 3600000, // +1 heure
  },
  perMinute: {
    count: 0,
    resetTime: Date.now() + 60000, // +1 minute
  },
};

/**
 * Vérifie et met à jour les limites d'utilisation
 * @returns { allowed: boolean, message?: string, limits: { daily, hourly, perMinute } }
 */
export function checkRateLimit(config: RateLimitConfig = DEFAULT_CONFIG): {
  allowed: boolean;
  message?: string;
  limits: {
    daily: { used: number; max: number; resetAt: string };
    hourly: { used: number; max: number; resetAt: string };
    perMinute: { used: number; max: number; resetAt: string };
  };
} {
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];

  // Réinitialiser le compteur quotidien si c'est un nouveau jour
  if (rateLimitData.daily.resetDate !== today) {
    rateLimitData.daily.count = 0;
    rateLimitData.daily.resetDate = today;
  }

  // Réinitialiser le compteur horaire si l'heure est passée
  if (now >= rateLimitData.hourly.resetTime) {
    rateLimitData.hourly.count = 0;
    rateLimitData.hourly.resetTime = now + 3600000;
  }

  // Réinitialiser le compteur par minute si la minute est passée
  if (now >= rateLimitData.perMinute.resetTime) {
    rateLimitData.perMinute.count = 0;
    rateLimitData.perMinute.resetTime = now + 60000;
  }

  // Vérifier les limites
  const dailyReset = new Date(rateLimitData.daily.resetDate);
  dailyReset.setDate(dailyReset.getDate() + 1);
  dailyReset.setHours(0, 0, 0, 0);

  const hourlyReset = new Date(rateLimitData.hourly.resetTime);
  const perMinuteReset = new Date(rateLimitData.perMinute.resetTime);

  if (rateLimitData.daily.count >= config.maxCallsPerDay) {
    return {
      allowed: false,
      message: `Limite quotidienne atteinte (${config.maxCallsPerDay} appels/jour). Réessayez demain.`,
      limits: {
        daily: {
          used: rateLimitData.daily.count,
          max: config.maxCallsPerDay,
          resetAt: dailyReset.toISOString(),
        },
        hourly: {
          used: rateLimitData.hourly.count,
          max: config.maxCallsPerHour,
          resetAt: hourlyReset.toISOString(),
        },
        perMinute: {
          used: rateLimitData.perMinute.count,
          max: config.maxCallsPerMinute,
          resetAt: perMinuteReset.toISOString(),
        },
      },
    };
  }

  if (rateLimitData.hourly.count >= config.maxCallsPerHour) {
    return {
      allowed: false,
      message: `Limite horaire atteinte (${config.maxCallsPerHour} appels/heure). Réessayez dans ${Math.ceil((rateLimitData.hourly.resetTime - now) / 60000)} minutes.`,
      limits: {
        daily: {
          used: rateLimitData.daily.count,
          max: config.maxCallsPerDay,
          resetAt: dailyReset.toISOString(),
        },
        hourly: {
          used: rateLimitData.hourly.count,
          max: config.maxCallsPerHour,
          resetAt: hourlyReset.toISOString(),
        },
        perMinute: {
          used: rateLimitData.perMinute.count,
          max: config.maxCallsPerMinute,
          resetAt: perMinuteReset.toISOString(),
        },
      },
    };
  }

  if (rateLimitData.perMinute.count >= config.maxCallsPerMinute) {
    return {
      allowed: false,
      message: `Limite par minute atteinte (${config.maxCallsPerMinute} appels/minute). Réessayez dans ${Math.ceil((rateLimitData.perMinute.resetTime - now) / 1000)} secondes.`,
      limits: {
        daily: {
          used: rateLimitData.daily.count,
          max: config.maxCallsPerDay,
          resetAt: dailyReset.toISOString(),
        },
        hourly: {
          used: rateLimitData.hourly.count,
          max: config.maxCallsPerHour,
          resetAt: hourlyReset.toISOString(),
        },
        perMinute: {
          used: rateLimitData.perMinute.count,
          max: config.maxCallsPerMinute,
          resetAt: perMinuteReset.toISOString(),
        },
      },
    };
  }

  // Toutes les limites sont OK, incrémenter les compteurs
  rateLimitData.daily.count++;
  rateLimitData.hourly.count++;
  rateLimitData.perMinute.count++;

  return {
    allowed: true,
    limits: {
      daily: {
        used: rateLimitData.daily.count,
        max: config.maxCallsPerDay,
        resetAt: dailyReset.toISOString(),
      },
      hourly: {
        used: rateLimitData.hourly.count,
        max: config.maxCallsPerHour,
        resetAt: hourlyReset.toISOString(),
      },
      perMinute: {
        used: rateLimitData.perMinute.count,
        max: config.maxCallsPerMinute,
        resetAt: perMinuteReset.toISOString(),
      },
    },
  };
}

/**
 * Récupère les statistiques actuelles sans incrémenter
 */
export function getRateLimitStats(config: RateLimitConfig = DEFAULT_CONFIG): {
  limits: {
    daily: { used: number; max: number; resetAt: string };
    hourly: { used: number; max: number; resetAt: string };
    perMinute: { used: number; max: number; resetAt: string };
  };
} {
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];

  // Réinitialiser si nécessaire (sans incrémenter)
  if (rateLimitData.daily.resetDate !== today) {
    rateLimitData.daily.count = 0;
    rateLimitData.daily.resetDate = today;
  }

  if (now >= rateLimitData.hourly.resetTime) {
    rateLimitData.hourly.count = 0;
    rateLimitData.hourly.resetTime = now + 3600000;
  }

  if (now >= rateLimitData.perMinute.resetTime) {
    rateLimitData.perMinute.count = 0;
    rateLimitData.perMinute.resetTime = now + 60000;
  }

  const dailyReset = new Date(rateLimitData.daily.resetDate);
  dailyReset.setDate(dailyReset.getDate() + 1);
  dailyReset.setHours(0, 0, 0, 0);

  const hourlyReset = new Date(rateLimitData.hourly.resetTime);
  const perMinuteReset = new Date(rateLimitData.perMinute.resetTime);

  return {
    limits: {
      daily: {
        used: rateLimitData.daily.count,
        max: config.maxCallsPerDay,
        resetAt: dailyReset.toISOString(),
      },
      hourly: {
        used: rateLimitData.hourly.count,
        max: config.maxCallsPerHour,
        resetAt: hourlyReset.toISOString(),
      },
      perMinute: {
        used: rateLimitData.perMinute.count,
        max: config.maxCallsPerMinute,
        resetAt: perMinuteReset.toISOString(),
      },
    },
  };
}

/**
 * Réinitialise les compteurs (pour les tests ou l'admin)
 */
export function resetRateLimit(): void {
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];

  rateLimitData = {
    daily: {
      count: 0,
      resetDate: today,
    },
    hourly: {
      count: 0,
      resetTime: now + 3600000,
    },
    perMinute: {
      count: 0,
      resetTime: now + 60000,
    },
  };
}
