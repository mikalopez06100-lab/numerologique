'use client';

import React from 'react';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';

interface OtherStudiesProps {
  prenom: string;
  nom: string;
  dateNaissance: string;
}

export const OtherStudies: React.FC<OtherStudiesProps> = ({
  prenom,
  nom,
  dateNaissance,
}) => {
  const router = useRouter();

  const studies = [
    {
      id: 'annee-personnelle',
      title: '📅 Année Personnelle',
      description: 'Découvrez votre année personnelle avec un détail mois par mois',
      icon: '📅',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      id: 'compatibilite-amoureuse',
      title: '💕 Compatibilité Amoureuse',
      description: 'Analysez votre compatibilité avec votre partenaire',
      icon: '💕',
      color: 'from-pink-500 to-rose-400',
    },
    {
      id: 'compatibilite-familiale',
      title: '👨‍👩‍👧‍👦 Compatibilité Familiale',
      description: 'Analysez votre compatibilité avec vos enfants ou parents',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-orange-500 to-amber-400',
    },
    {
      id: 'prevision-3-6-9-ans',
      title: '🔮 Prévisions 3/6/9 ans',
      description: 'Découvrez vos cycles de vie sur 3, 6 et 9 ans',
      icon: '🔮',
      color: 'from-purple-500 to-indigo-400',
    },
    {
      id: 'compatibilite-business',
      title: '💼 Compatibilité Business/Pro',
      description: 'Analysez votre compatibilité professionnelle',
      icon: '💼',
      color: 'from-green-500 to-emerald-400',
    },
    {
      id: 'dates-optimales',
      title: '📆 Choix de Dates Optimales',
      description: 'Trouvez les meilleures dates pour vos projets importants',
      icon: '📆',
      color: 'from-yellow-500 to-orange-400',
    },
  ];

  const handleStudyClick = (studyId: string) => {
    // Pour l'instant, on redirige vers une page dédiée (à créer)
    // On peut aussi passer les données via query params ou localStorage
    router.push(`/etudes/${studyId}?prenom=${encodeURIComponent(prenom)}&nom=${encodeURIComponent(nom)}&date=${encodeURIComponent(dateNaissance)}`);
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-white/10 shadow-2xl shadow-purple-500/20">
      <h2 className="text-2xl font-semibold text-white mb-2">
        🌟 Découvrez d'autres analyses
      </h2>
      <p className="text-gray-300 mb-6">
        Explorez d'autres aspects de votre profil numérologique
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studies.map((study) => (
          <button
            key={study.id}
            onClick={() => handleStudyClick(study.id)}
            className={`
              relative overflow-hidden rounded-lg p-6 text-left
              bg-gradient-to-br ${study.color}
              hover:scale-105 transition-transform duration-200
              border border-white/20
            `}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-2">{study.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {study.title}
              </h3>
              <p className="text-white/90 text-sm">
                {study.description}
              </p>
            </div>
            <div className="absolute inset-0 bg-black/10 hover:bg-black/5 transition-colors"></div>
          </button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <Button
          variant="secondary"
          onClick={() => router.push('/')}
          className="w-full"
        >
          🔄 Nouvelle Analyse Complète
        </Button>
      </div>
    </div>
  );
};
