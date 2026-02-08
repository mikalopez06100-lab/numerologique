'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
  animationDuration: number;
}

export const StarsBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [lines, setLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Générer les étoiles uniquement côté client
    const generatedStars: Star[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDuration: Math.random() * 3 + 2,
    }));

    // Générer les lignes géométriques
    const generatedLines = Array.from({ length: 20 }, () => ({
      x1: Math.random() * 1000,
      y1: Math.random() * 1000,
      x2: Math.random() * 1000,
      y2: Math.random() * 1000,
    }));

    setStars(generatedStars);
    setLines(generatedLines);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Étoiles animées */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.width}px`,
              height: `${star.height}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.animationDuration}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Lignes géométriques subtiles */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="white"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>
    </>
  );
};
