'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalyseNumerologique } from '@/types/numerologie';
import { Button } from '@/components/ui/Button';
import { StarsBackground } from '@/components/StarsBackground';
import { OtherStudies } from '@/components/OtherStudies';

export default function ResultatsPage() {
  const [analyse, setAnalyse] = useState<AnalyseNumerologique | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Récupérer l'analyse depuis le localStorage
    const analyseStr = localStorage.getItem('derniereAnalyse');
    if (analyseStr) {
      try {
        setAnalyse(JSON.parse(analyseStr));
      } catch (error) {
        console.error('Erreur lors du parsing de l\'analyse:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  if (!analyse) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
          <StarsBackground />
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  const analyseData = analyse.analyse;
  const hasNewStructure = analyseData.introduction || analyseData.cheminDeVieDetail;
  
  // Fonction helper pour extraire un nombre d'un texte
  const extractNumberFromText = (text: string): number | null => {
    // Chercher des patterns comme "chemin de vie 11" ou "nombre 5"
    const match = text.match(/\b(\d{1,2})\b/);
    return match ? parseInt(match[1], 10) : null;
  };
  
  // Extraire les nombres depuis les détails si les valeurs directes ne sont pas présentes
  const cheminDeVie = analyseData.cheminDeVie ?? 
    (analyseData.cheminDeVieDetail?.explicationCalcul ? 
      extractNumberFromText(analyseData.cheminDeVieDetail.explicationCalcul) : null);
  const nombreExpression = analyseData.nombreExpression ?? 
    (analyseData.nombreExpressionDetail?.explicationCalcul ? 
      extractNumberFromText(analyseData.nombreExpressionDetail.explicationCalcul) : null);
  const nombreIntime = analyseData.nombreIntime ?? 
    (analyseData.nombreIntimeDetail?.explicationCalcul ? 
      extractNumberFromText(analyseData.nombreIntimeDetail.explicationCalcul) : null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond cosmique avec étoiles */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <StarsBackground />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Votre Analyse Numérologique
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              {analyse.donnees.prenom} {analyse.donnees.nom}
            </p>

            {/* Nombres principaux - EN HAUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-500/20 text-center">
                <h3 className="text-gray-400 text-sm mb-2">Chemin de Vie</h3>
                <div className="text-5xl font-bold text-purple-400">
                  {cheminDeVie ?? '—'}
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-500/20 text-center">
                <h3 className="text-gray-400 text-sm mb-2">Expression</h3>
                <div className="text-5xl font-bold text-purple-400">
                  {nombreExpression ?? '—'}
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-500/20 text-center">
                <h3 className="text-gray-400 text-sm mb-2">Intime</h3>
                <div className="text-5xl font-bold text-purple-400">
                  {nombreIntime ?? '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Contenu détaillé de l'analyse */}
          {hasNewStructure ? (
          // Nouvelle structure OpenAI
          <>
            {/* Introduction */}
            {analyseData.introduction && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Introduction
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {analyseData.introduction}
                </p>
              </div>
            )}

            {/* Chemin de Vie */}
            {analyseData.cheminDeVieDetail && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Chemin de Vie
                </h2>
                {analyseData.cheminDeVieDetail.explicationCalcul && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Calcul
                    </h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {analyseData.cheminDeVieDetail.explicationCalcul}
                    </p>
                  </div>
                )}
                {analyseData.cheminDeVieDetail.signification && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-4">
                      Signification
                    </h3>
                    <div className="space-y-4">
                      {analyseData.cheminDeVieDetail.signification.tendancesPersonnalite && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Tendances de personnalité</h4>
                          <p className="text-gray-300">{analyseData.cheminDeVieDetail.signification.tendancesPersonnalite}</p>
                        </div>
                      )}
                      {analyseData.cheminDeVieDetail.signification.forcesNaturelles && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Forces naturelles</h4>
                          <p className="text-gray-300">{analyseData.cheminDeVieDetail.signification.forcesNaturelles}</p>
                        </div>
                      )}
                      {analyseData.cheminDeVieDetail.signification.defisRecurrents && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Défis récurrents</h4>
                          <p className="text-gray-300">{analyseData.cheminDeVieDetail.signification.defisRecurrents}</p>
                        </div>
                      )}
                      {analyseData.cheminDeVieDetail.signification.environnementFavorable && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Environnement favorable</h4>
                          <p className="text-gray-300">{analyseData.cheminDeVieDetail.signification.environnementFavorable}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nombre d'Expression */}
            {analyseData.nombreExpressionDetail && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Nombre d'Expression
                </h2>
                {analyseData.nombreExpressionDetail.explicationCalcul && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Calcul
                    </h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {analyseData.nombreExpressionDetail.explicationCalcul}
                    </p>
                  </div>
                )}
                {analyseData.nombreExpressionDetail.interpretation && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-4">
                      Interprétation
                    </h3>
                    <div className="space-y-4">
                      {analyseData.nombreExpressionDetail.interpretation.maniereAgir && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Manière d'agir</h4>
                          <p className="text-gray-300">{analyseData.nombreExpressionDetail.interpretation.maniereAgir}</p>
                        </div>
                      )}
                      {analyseData.nombreExpressionDetail.interpretation.talentsDominants && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Talents dominants</h4>
                          <p className="text-gray-300">{analyseData.nombreExpressionDetail.interpretation.talentsDominants}</p>
                        </div>
                      )}
                      {analyseData.nombreExpressionDetail.interpretation.postureRelationnelle && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Posture relationnelle et professionnelle</h4>
                          <p className="text-gray-300">{analyseData.nombreExpressionDetail.interpretation.postureRelationnelle}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nombre Intime */}
            {analyseData.nombreIntimeDetail && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Nombre Intime
                </h2>
                {analyseData.nombreIntimeDetail.explicationCalcul && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Calcul
                    </h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {analyseData.nombreIntimeDetail.explicationCalcul}
                    </p>
                  </div>
                )}
                {analyseData.nombreIntimeDetail.interpretation && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Interprétation
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {analyseData.nombreIntimeDetail.interpretation.motivationsProfondes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cohérence Globale */}
            {analyseData.coherenceGlobale && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Cohérence Globale du Profil
                </h2>
                {analyseData.coherenceGlobale.analyse && (
                  <div className="mb-4">
                    <p className="text-gray-300 leading-relaxed">
                      {analyseData.coherenceGlobale.analyse}
                    </p>
                  </div>
                )}
                {analyseData.coherenceGlobale.axesDeveloppement && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Axes de développement
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {analyseData.coherenceGlobale.axesDeveloppement}
                    </p>
                  </div>
                )}
                {analyseData.coherenceGlobale.leviersEvolution && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Leviers d'évolution
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {analyseData.coherenceGlobale.leviersEvolution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Conclusion */}
            {analyseData.conclusion && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Conclusion
                </h2>
                {analyseData.conclusion.synthese && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Synthèse
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {analyseData.conclusion.synthese}
                    </p>
                  </div>
                )}
                {analyseData.conclusion.conseilsOrientations && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Conseils et orientations
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {analyseData.conclusion.conseilsOrientations}
                    </p>
                  </div>
                )}
                {analyseData.conclusion.perspectiveAvenir && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-2">
                      Perspective d'avenir
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {analyseData.conclusion.perspectiveAvenir}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Ancienne structure (fallback)
          <>
            {/* Description */}
            {analyseData.description && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Description
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {analyseData.description}
                </p>
              </div>
            )}

            {/* Points forts */}
            {analyseData.pointsForts && analyseData.pointsForts.length > 0 && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Points Forts
                </h2>
                <ul className="space-y-2">
                  {analyseData.pointsForts.map((point, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Défis */}
            {analyseData.defis && analyseData.defis.length > 0 && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Défis à Surmonter
                </h2>
                <ul className="space-y-2">
                  {analyseData.defis.map((defi, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">⚡</span>
                      <span>{defi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conseils */}
            {analyseData.conseils && analyseData.conseils.length > 0 && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Conseils Personnalisés
                </h2>
                <ul className="space-y-2">
                  {analyseData.conseils.map((conseil, index) => (
                    <li key={index} className="text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">💡</span>
                      <span>{conseil}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
          )}

          {/* Section autres études - À LA FIN */}
          <div className="mt-12">
            <OtherStudies
              prenom={analyse.donnees.prenom}
              nom={analyse.donnees.nom}
              dateNaissance={analyse.donnees.dateNaissance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
