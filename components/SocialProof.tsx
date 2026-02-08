'use client';

import React from 'react';

export const SocialProof: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 mt-8">
      <p className="text-gray-300 text-sm">
        10 000+ analyses déjà réalisées
      </p>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    </div>
  );
};
