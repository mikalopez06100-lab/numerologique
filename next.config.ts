import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour Vercel
  output: 'standalone',
  
  // Optimisations pour la production
  compress: true,
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
