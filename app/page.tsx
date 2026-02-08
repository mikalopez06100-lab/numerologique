'use client';

import { useState, useEffect } from 'react';
import { FormulaireNumerologie } from '@/components/FormulaireNumerologie';
import { EmailInput } from '@/components/EmailInput';
import { SocialProof } from '@/components/SocialProof';
import { StarsBackground } from '@/components/StarsBackground';
import { FormulaireNumerologie as FormulaireType } from '@/types/numerologie';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [step, setStep] = useState<'email' | 'form'>('email');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnalyse, setIsLoadingAnalyse] = useState(false);
  const [hasAnalyse, setHasAnalyse] = useState<boolean>(false);
  const [isCheckingAnalyse, setIsCheckingAnalyse] = useState(false);
  const router = useRouter();

  // Vérifier si l'utilisateur est déjà authentifié et s'il a une analyse
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        if (data.authenticated && data.email) {
          setEmail(data.email);
          setStep('form');
          
          // Vérifier si l'utilisateur a déjà une analyse avec timeout
          setIsCheckingAnalyse(true);
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes max
            
            const analyseResponse = await fetch('/api/analyse/has-analyse', {
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            
            if (analyseResponse.ok) {
              const analyseData = await analyseResponse.json();
              setHasAnalyse(analyseData.hasAnalyse === true);
            } else {
              setHasAnalyse(false);
            }
          } catch (error) {
            console.error('Erreur lors de la vérification de l\'analyse:', error);
            // En cas d'erreur, on assume qu'il n'a pas d'analyse pour permettre la création
            setHasAnalyse(false);
          } finally {
            setIsCheckingAnalyse(false);
          }
        } else {
          setHasAnalyse(false);
        }
      } catch (error) {
        // Pas authentifié, rester sur l'étape email
        setHasAnalyse(false);
      }
    };
    checkAuth();
  }, []);

  const handleEmailSubmit = async (userEmail: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        // Si la réponse n'est pas OK, essayer de parser le JSON pour obtenir le message d'erreur
        try {
          const errorData = await response.json();
          alert(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
        } catch {
          alert(`Erreur ${response.status}: ${response.statusText}`);
        }
        return;
      }

      const result = await response.json();

      if (result.success) {
        // Enregistrer l'email et passer directement au formulaire
        setEmail(userEmail);
        setStep('form');
        
        // Vérifier si l'utilisateur a déjà une analyse avec timeout
        setIsCheckingAnalyse(true);
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes max
          
          const analyseResponse = await fetch('/api/analyse/has-analyse', {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          
          if (analyseResponse.ok) {
            const analyseData = await analyseResponse.json();
            setHasAnalyse(analyseData.hasAnalyse === true);
          } else {
            setHasAnalyse(false);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'analyse:', error);
          // En cas d'erreur, on assume qu'il n'a pas d'analyse pour permettre la création
          setHasAnalyse(false);
        } finally {
          setIsCheckingAnalyse(false);
        }
      } else {
        const errorMessage = result.error || 'Erreur lors de l\'enregistrement de l\'email';
        const details = result.details ? `\n\nDétails: ${result.details}` : '';
        alert(errorMessage + details);
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Une erreur est survenue: ${errorMessage}\n\nVeuillez vérifier votre connexion et réessayer.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessAnalyse = async () => {
    setIsLoadingAnalyse(true);
    try {
      const response = await fetch('/api/analyse/mon-analyse');
      const result = await response.json();

      if (result.success && result.data) {
        // Stocker l'analyse dans le localStorage
        localStorage.setItem('derniereAnalyse', JSON.stringify(result.data));
        // Rediriger vers la page de résultats
        router.push('/resultats');
      } else {
        alert(result.error || 'Aucune analyse trouvée. Veuillez créer une nouvelle analyse.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la récupération de l\'analyse.');
    } finally {
      setIsLoadingAnalyse(false);
    }
  };

  const handleFormSubmit = async (data: FormulaireType) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, email }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Stocker l'analyse dans le localStorage pour la page de résultats
        localStorage.setItem('derniereAnalyse', JSON.stringify(result.data));
        // Mettre à jour l'état pour afficher le bouton
        setHasAnalyse(true);
        // Rediriger vers la page de résultats
        router.push('/resultats');
      } else {
        console.error('Erreur API:', result);
        let errorMessage = result.error || 'Une erreur est survenue lors de l\'analyse';
        
        // Si l'utilisateur a déjà une analyse, mettre à jour l'état
        if (response.status === 403 && errorMessage.includes('déjà effectué')) {
          setHasAnalyse(true);
        }
        
        if (response.status === 429 && result.rateLimit) {
          errorMessage += `\n\nLimites d'utilisation:\n`;
          errorMessage += `- Quotidien: ${result.rateLimit.daily.used}/${result.rateLimit.daily.max}\n`;
          errorMessage += `- Horaire: ${result.rateLimit.hourly.used}/${result.rateLimit.hourly.max}\n`;
          errorMessage += `- Par minute: ${result.rateLimit.perMinute.used}/${result.rateLimit.perMinute.max}`;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond cosmique avec étoiles */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <StarsBackground />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Votre Profil Numérologique en 30 secondes
            </h1>
            <p className="text-lg text-gray-300">
              Une analyse immédiate, précise et personnalisée.
            </p>
          </div>

          {/* Formulaire dans un conteneur avec effet glassmorphism */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl shadow-purple-500/20">
            {step === 'email' ? (
              <EmailInput
                onSubmit={handleEmailSubmit}
                isLoading={isLoading}
              />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Email enregistré : <span className="text-purple-400">{email}</span>
                  </div>
                  {hasAnalyse && (
                    <button
                      onClick={handleAccessAnalyse}
                      disabled={isLoadingAnalyse}
                      className="px-4 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors bg-black/40 backdrop-blur-md rounded-lg border border-purple-500/30 hover:border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingAnalyse ? 'Chargement...' : 'Voir mon analyse'}
                    </button>
                  )}
                </div>
                {isCheckingAnalyse ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400">Vérification...</div>
                  </div>
                ) : hasAnalyse ? (
                  <div className="text-center py-8">
                    <p className="text-gray-300 mb-4">
                      Vous avez déjà réalisé une analyse numérologique.
                    </p>
                    <p className="text-sm text-gray-400 mb-6">
                      Cliquez sur "Voir mon analyse" ci-dessus pour consulter votre profil.
                    </p>
                    <p className="text-xs text-gray-500">
                      Chaque email ne peut effectuer qu'une seule analyse.
                    </p>
                  </div>
                ) : (
                  <FormulaireNumerologie
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                  />
                )}
              </>
            )}
          </div>

          {/* Social Proof */}
          <SocialProof />
        </div>
      </div>
    </div>
  );
}
