'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  value,
  ...props
}) => {
  // S'assurer que value est toujours une string (pas undefined)
  const inputValue = value ?? '';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-white/10 backdrop-blur-sm
          border border-white/20
          text-white placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
          transition-all duration-200
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        value={inputValue}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
};
