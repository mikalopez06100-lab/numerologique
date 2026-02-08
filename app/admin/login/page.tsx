'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarsBackground } from '@/components/StarsBackground';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Mot de passe incorrect');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <StarsBackground />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl shadow-purple-500/20 max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            🔐 Administration
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Accès réservé aux administrateurs
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Entrez le mot de passe admin"
              error={error}
              disabled={isLoading}
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
