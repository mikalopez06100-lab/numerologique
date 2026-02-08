'use client';

import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface EmailInputProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('L\'email est requis');
      return;
    }

    if (!validateEmail(email)) {
      setError('Format d\'email invalide');
      return;
    }

    await onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Adresse email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="votre@email.com"
          error={error}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-400 mt-2">
          Votre email sera enregistré pour accéder à l'analyse. Chaque email ne peut effectuer qu'une seule analyse.
        </p>
      </div>

      <div className="flex justify-center pt-4">
        <Button type="submit" isLoading={isLoading} className="min-w-[200px]">
          Continuer →
        </Button>
      </div>
    </form>
  );
};
