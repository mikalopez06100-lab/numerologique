'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { StarsBackground } from '@/components/StarsBackground';
import { Button } from '@/components/ui/Button';

type StudyType = 
  | 'annee-personnelle'
  | 'compatibilite-amoureuse'
  | 'compatibilite-familiale'
  | 'prevision-3-6-9-ans'
  | 'compatibilite-business'
  | 'dates-optimales';

interface StudyResult {
  type: StudyType;
  donnees: any;
  calculs: any;
  analyse: any;
}

const studyTitles: Record<StudyType, string> = {
  'annee-personnelle': '📅 Année Personnelle',
  'compatibilite-amoureuse': '💕 Compatibilité Amoureuse',
  'compatibilite-familiale': '👨‍👩‍👧‍👦 Compatibilité Familiale',
  'prevision-3-6-9-ans': '🔮 Prévisions 3/6/9 ans',
  'compatibilite-business': '💼 Compatibilité Business/Pro',
  'dates-optimales': '📆 Choix de Dates Optimales',
};

export default function StudyResultatsPage() {
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState<StudyResult | null>(null);

  useEffect(() => {
    const etudeStr = localStorage.getItem('derniereEtude');
    if (etudeStr) {
      try {
        const etude = JSON.parse(etudeStr);
        if (etude.type === params.type) {
          setResult(etude);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Erreur lors du parsing de l\'étude:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router, params.type]);

  if (!result) {
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

  const renderContent = () => {
    const { analyse, type } = result;

    switch (type) {
      case 'annee-personnelle':
        return (
          <>
            {analyse.introduction && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {analyse.introduction}
                </p>
              </div>
            )}

            {analyse.anneePersonnelle && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Année Personnelle {result.donnees.annee}
                </h2>
                {analyse.anneePersonnelle.explicationCalcul && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Calcul</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {analyse.anneePersonnelle.explicationCalcul}
                    </p>
                  </div>
                )}
                {analyse.anneePersonnelle.signification && (
                  <div className="space-y-4">
                    {analyse.anneePersonnelle.signification.themes && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Thèmes principaux</h4>
                        <p className="text-gray-300">{analyse.anneePersonnelle.signification.themes}</p>
                      </div>
                    )}
                    {analyse.anneePersonnelle.signification.opportunites && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Opportunités</h4>
                        <p className="text-gray-300">{analyse.anneePersonnelle.signification.opportunites}</p>
                      </div>
                    )}
                    {analyse.anneePersonnelle.signification.defis && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Défis</h4>
                        <p className="text-gray-300">{analyse.anneePersonnelle.signification.defis}</p>
                      </div>
                    )}
                    {analyse.anneePersonnelle.signification.energie && (
                      <div>
                        <h4 className="text-white font-medium mb-2">Énergie dominante</h4>
                        <p className="text-gray-300">{analyse.anneePersonnelle.signification.energie}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {analyse.mois && Array.isArray(analyse.mois) && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Détail Mois par Mois
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyse.mois.map((mois: any, index: number) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h3 className="text-lg font-semibold text-purple-300 mb-2">
                        {mois.mois} (Nombre {mois.nombre})
                      </h3>
                      {mois.themes && (
                        <p className="text-gray-300 text-sm mb-2">
                          <strong className="text-white">Thèmes :</strong> {mois.themes}
                        </p>
                      )}
                      {mois.conseils && (
                        <p className="text-gray-300 text-sm">
                          <strong className="text-white">Conseils :</strong> {mois.conseils}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyse.conclusion && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Conclusion</h2>
                {analyse.conclusion.synthese && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analyse.conclusion.synthese}
                  </p>
                )}
                {analyse.conclusion.recommandations && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Recommandations</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {analyse.conclusion.recommandations}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        );

      case 'compatibilite-amoureuse':
      case 'compatibilite-business':
      case 'compatibilite-familiale':
        return (
          <>
            {analyse.introduction && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {analyse.introduction}
                </p>
              </div>
            )}

            {analyse.analyseGlobale && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Analyse Globale</h2>
                {analyse.analyseGlobale.evaluation && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analyse.analyseGlobale.evaluation}
                  </p>
                )}
                {analyse.analyseGlobale.pointsForts && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Points forts</h3>
                    <p className="text-gray-300">{analyse.analyseGlobale.pointsForts}</p>
                  </div>
                )}
                {analyse.analyseGlobale.pointsAttention && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Points d'attention</h3>
                    <p className="text-gray-300">{analyse.analyseGlobale.pointsAttention}</p>
                  </div>
                )}
              </div>
            )}

            {analyse.compatibiliteCheminDeVie && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Compatibilité Chemin de Vie</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {analyse.compatibiliteCheminDeVie.analyse}
                </p>
                {analyse.compatibiliteCheminDeVie.complementarite && (
                  <p className="text-gray-300 leading-relaxed">
                    {analyse.compatibiliteCheminDeVie.complementarite}
                  </p>
                )}
              </div>
            )}

            {analyse.compatibiliteExpression && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Compatibilité Expression</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {analyse.compatibiliteExpression.analyse}
                </p>
                {analyse.compatibiliteExpression.dynamique && (
                  <p className="text-gray-300 leading-relaxed">
                    {analyse.compatibiliteExpression.dynamique}
                  </p>
                )}
              </div>
            )}

            {analyse.compatibiliteIntime && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Compatibilité Intime</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {analyse.compatibiliteIntime.analyse}
                </p>
                {analyse.compatibiliteIntime.harmonie && (
                  <p className="text-gray-300 leading-relaxed">
                    {analyse.compatibiliteIntime.harmonie}
                  </p>
                )}
              </div>
            )}

            {analyse.conseils && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Conseils</h2>
                {analyse.conseils.collaboration && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Collaboration</h3>
                    <p className="text-gray-300">{analyse.conseils.collaboration}</p>
                  </div>
                )}
                {analyse.conseils.roles && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Rôles et responsabilités</h3>
                    <p className="text-gray-300">{analyse.conseils.roles}</p>
                  </div>
                )}
                {analyse.conseils.communication && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Communication</h3>
                    <p className="text-gray-300">{analyse.conseils.communication}</p>
                  </div>
                )}
                {analyse.conseils.environnement && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Environnement de travail</h3>
                    <p className="text-gray-300">{analyse.conseils.environnement}</p>
                  </div>
                )}
                {analyse.conseils.croissance && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Croissance</h3>
                    <p className="text-gray-300">{analyse.conseils.croissance}</p>
                  </div>
                )}
                {analyse.conseils.momentsFavorables && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Moments favorables</h3>
                    <p className="text-gray-300">{analyse.conseils.momentsFavorables}</p>
                  </div>
                )}
              </div>
            )}

            {analyse.conclusion && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Conclusion</h2>
                {analyse.conclusion.synthese && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analyse.conclusion.synthese}
                  </p>
                )}
                {analyse.conclusion.perspective && (
                  <p className="text-gray-300 leading-relaxed">
                    {analyse.conclusion.perspective}
                  </p>
                )}
              </div>
            )}
          </>
        );

      case 'prevision-3-6-9-ans':
        return (
          <>
            {analyse.introduction && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {analyse.introduction}
                </p>
              </div>
            )}

            {analyse.prevision3Ans && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Prévision 3 ans ({analyse.prevision3Ans.annee})
                </h2>
                <div className="space-y-4">
                  {analyse.prevision3Ans.themes && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Thèmes</h3>
                      <p className="text-gray-300">{analyse.prevision3Ans.themes}</p>
                    </div>
                  )}
                  {analyse.prevision3Ans.opportunites && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Opportunités</h3>
                      <p className="text-gray-300">{analyse.prevision3Ans.opportunites}</p>
                    </div>
                  )}
                  {analyse.prevision3Ans.defis && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Défis</h3>
                      <p className="text-gray-300">{analyse.prevision3Ans.defis}</p>
                    </div>
                  )}
                  {analyse.prevision3Ans.recommandations && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Recommandations</h3>
                      <p className="text-gray-300">{analyse.prevision3Ans.recommandations}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {analyse.prevision6Ans && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Prévision 6 ans ({analyse.prevision6Ans.annee})
                </h2>
                <div className="space-y-4">
                  {analyse.prevision6Ans.themes && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Thèmes</h3>
                      <p className="text-gray-300">{analyse.prevision6Ans.themes}</p>
                    </div>
                  )}
                  {analyse.prevision6Ans.opportunites && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Opportunités</h3>
                      <p className="text-gray-300">{analyse.prevision6Ans.opportunites}</p>
                    </div>
                  )}
                  {analyse.prevision6Ans.defis && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Défis</h3>
                      <p className="text-gray-300">{analyse.prevision6Ans.defis}</p>
                    </div>
                  )}
                  {analyse.prevision6Ans.recommandations && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Recommandations</h3>
                      <p className="text-gray-300">{analyse.prevision6Ans.recommandations}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {analyse.prevision9Ans && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Prévision 9 ans ({analyse.prevision9Ans.annee})
                </h2>
                <div className="space-y-4">
                  {analyse.prevision9Ans.themes && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Thèmes</h3>
                      <p className="text-gray-300">{analyse.prevision9Ans.themes}</p>
                    </div>
                  )}
                  {analyse.prevision9Ans.opportunites && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Opportunités</h3>
                      <p className="text-gray-300">{analyse.prevision9Ans.opportunites}</p>
                    </div>
                  )}
                  {analyse.prevision9Ans.defis && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Défis</h3>
                      <p className="text-gray-300">{analyse.prevision9Ans.defis}</p>
                    </div>
                  )}
                  {analyse.prevision9Ans.recommandations && (
                    <div>
                      <h3 className="text-lg font-medium text-purple-300 mb-2">Recommandations</h3>
                      <p className="text-gray-300">{analyse.prevision9Ans.recommandations}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {analyse.analyseGlobale && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Analyse Globale</h2>
                {analyse.analyseGlobale.evolution && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analyse.analyseGlobale.evolution}
                  </p>
                )}
                {analyse.analyseGlobale.cycles && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analyse.analyseGlobale.cycles}
                  </p>
                )}
                {analyse.analyseGlobale.synergie && (
                  <p className="text-gray-300 leading-relaxed">
                    {analyse.analyseGlobale.synergie}
                  </p>
                )}
              </div>
            )}

            {analyse.conclusion && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Conclusion</h2>
                {analyse.conclusion.synthese && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analyse.conclusion.synthese}
                  </p>
                )}
                {analyse.conclusion.conseils && (
                  <p className="text-gray-300 leading-relaxed">
                    {analyse.conclusion.conseils}
                  </p>
                )}
              </div>
            )}
          </>
        );

      case 'dates-optimales':
        return (
          <>
            {analyse.introduction && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {analyse.introduction}
                </p>
              </div>
            )}

            {analyse.criteres && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Critères de Sélection</h2>
                {analyse.criteres.explication && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analyse.criteres.explication}
                  </p>
                )}
                {analyse.criteres.methodologie && (
                  <p className="text-gray-300 leading-relaxed">
                    {analyse.criteres.methodologie}
                  </p>
                )}
              </div>
            )}

            {analyse.datesOptimales && Array.isArray(analyse.datesOptimales) && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-6">Dates Optimales</h2>
                <div className="space-y-4">
                  {analyse.datesOptimales.map((date: any, index: number) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-purple-300">
                          {date.date}
                        </h3>
                        <span className="text-sm text-gray-400">Nombre {date.nombreJour}</span>
                      </div>
                      {date.justification && (
                        <p className="text-gray-300 mb-2">
                          <strong className="text-white">Pourquoi :</strong> {date.justification}
                        </p>
                      )}
                      {date.energie && (
                        <p className="text-gray-300 mb-2">
                          <strong className="text-white">Énergie :</strong> {date.energie}
                        </p>
                      )}
                      {date.recommandation && (
                        <p className="text-gray-300">
                          <strong className="text-white">Recommandation :</strong> {date.recommandation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyse.datesAEviter && Array.isArray(analyse.datesAEviter) && analyse.datesAEviter.length > 0 && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-6">Dates à Éviter</h2>
                <div className="space-y-3">
                  {analyse.datesAEviter.map((date: any, index: number) => (
                    <div key={index} className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-red-300 font-medium">{date.date}</span>
                        <span className="text-red-400 text-sm">{date.raison}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analyse.conseils && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Conseils</h2>
                {analyse.conseils.preparation && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Préparation</h3>
                    <p className="text-gray-300">{analyse.conseils.preparation}</p>
                  </div>
                )}
                {analyse.conseils.momentsFavorables && (
                  <div>
                    <h3 className="text-lg font-medium text-purple-300 mb-2">Moments favorables</h3>
                    <p className="text-gray-300">{analyse.conseils.momentsFavorables}</p>
                  </div>
                )}
              </div>
            )}

            {analyse.conclusion && (
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
                <h2 className="text-2xl font-semibold text-white mb-4">Conclusion</h2>
                {analyse.conclusion.synthese && (
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {analyse.conclusion.synthese}
                  </p>
                )}
                {analyse.conclusion.recommandationFinale && (
                  <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Recommandation Finale</h3>
                    <p className="text-white">{analyse.conclusion.recommandationFinale}</p>
                  </div>
                )}
              </div>
            )}
          </>
        );

      default:
        return (
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-6 border border-white/10 shadow-2xl shadow-purple-500/20">
            <p className="text-gray-300">Type d'étude non reconnu</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <StarsBackground />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {studyTitles[result.type]}
            </h1>
            <p className="text-lg text-gray-300">
              {result.donnees.prenom} {result.donnees.nom}
            </p>
          </div>

          {/* Contenu */}
          {renderContent()}

          {/* Boutons */}
          <div className="flex gap-4 justify-center mt-8">
            <Button
              variant="secondary"
              onClick={() => router.push(`/etudes/${result.type}`)}
            >
              ← Nouvelle Analyse
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/resultats')}
            >
              Retour à l'analyse complète
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
