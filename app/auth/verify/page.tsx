'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StarsBackground } from '@/components/StarsBackground';
import { Button } from '@/components/ui/Button';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Token manquant dans l\'URL');
      return;
    }

    // Vérifier le token
    fetch(`/api/auth/verify?token=${token}`)
      .then(async (res) => {
        const data = await res.json();

        if (data.success) {
          setStatus('success');
          setMessage('Authentification réussie ! Redirection...');
          
          // Rediriger vers le formulaire après 2 secondes
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Erreur d\'authentification');
        }
      })
      .catch((error) => {
        setStatus('error');
        setMessage('Erreur lors de la vérification');
        console.error(error);
      });
  }, [searchParams, router]);

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl shadow-purple-500/20 max-w-md w-full text-center">
      {status === 'loading' && (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Vérification en cours...</h2>
          <p className="text-gray-300">Veuillez patienter</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentification réussie !</h2>
          <p className="text-gray-300 mb-4">{message}</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Erreur d'authentification</h2>
          <p className="text-gray-300 mb-6">{message}</p>
          <Button onClick={() => router.push('/')}>
            Retour à l'accueil
          </Button>
        </>
      )}
    </div>
  );
}

export default function VerifyAuthPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond cosmique avec étoiles */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <StarsBackground />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <Suspense fallback={
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl shadow-purple-500/20 max-w-md w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Chargement...</h2>
            <p className="text-gray-300">Veuillez patienter</p>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
