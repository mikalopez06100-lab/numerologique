'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StarsBackground } from '@/components/StarsBackground';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { convertirFormatVersDateHTML, convertirDateHTMLVersFormat } from '@/lib/numerologie';

type StudyType = 
  | 'annee-personnelle'
  | 'compatibilite-amoureuse'
  | 'compatibilite-familiale'
  | 'prevision-3-6-9-ans'
  | 'compatibilite-business'
  | 'dates-optimales';

interface StudyConfig {
  title: string;
  description: string;
  icon: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'date' | 'email';
    placeholder?: string;
    required?: boolean;
  }>;
}

const studyConfigs: Record<StudyType, StudyConfig> = {
  'annee-personnelle': {
    title: '📅 Année Personnelle',
    description: 'Découvrez votre année personnelle avec un détail mois par mois',
    icon: '📅',
    fields: [
      { name: 'annee', label: 'Année à analyser', type: 'text', placeholder: '2024', required: true },
    ],
  },
  'compatibilite-amoureuse': {
    title: '💕 Compatibilité Amoureuse',
    description: 'Analysez votre compatibilité avec votre partenaire',
    icon: '💕',
    fields: [
      { name: 'prenomPartenaire', label: 'Prénom du partenaire', type: 'text', required: true },
      { name: 'nomPartenaire', label: 'Nom du partenaire (optionnel, pour plus de fiabilité)', type: 'text', required: false },
      { name: 'dateNaissancePartenaire', label: 'Date de naissance du partenaire (optionnelle, pour plus de fiabilité)', type: 'date', required: false },
    ],
  },
  'compatibilite-familiale': {
    title: '👨‍👩‍👧‍👦 Compatibilité Familiale',
    description: 'Analysez votre compatibilité avec vos enfants ou parents',
    icon: '👨‍👩‍👧‍👦',
    fields: [
      { name: 'prenomPartenaire', label: 'Prénom de la personne', type: 'text', required: true },
      { name: 'nomPartenaire', label: 'Nom de famille (optionnel, pour plus de fiabilité)', type: 'text', required: false },
      { name: 'dateNaissancePartenaire', label: 'Date de naissance (optionnelle, pour plus de fiabilité)', type: 'date', required: false },
      { name: 'relation', label: 'Relation (ex: enfant, parent, frère, sœur...)', type: 'text', placeholder: 'Enfant, parent...', required: false },
    ],
  },
  'prevision-3-6-9-ans': {
    title: '🔮 Prévisions 3/6/9 ans',
    description: 'Découvrez vos cycles de vie sur 3, 6 et 9 ans',
    icon: '🔮',
    fields: [],
  },
  'compatibilite-business': {
    title: '💼 Compatibilité Business/Pro',
    description: 'Analysez votre compatibilité professionnelle',
    icon: '💼',
    fields: [
      { name: 'prenomPartenaire', label: 'Prénom du partenaire professionnel', type: 'text', required: true },
      { name: 'nomPartenaire', label: 'Nom du partenaire (optionnel, pour plus de fiabilité)', type: 'text', required: false },
      { name: 'dateNaissancePartenaire', label: 'Date de naissance (optionnelle, pour plus de fiabilité)', type: 'date', required: false },
      { name: 'metierPersonne1', label: 'Votre métier/poste', type: 'text', placeholder: 'Ex: Directeur commercial, Consultant...', required: false },
      { name: 'metierPersonne2', label: 'Métier/poste du partenaire', type: 'text', placeholder: 'Ex: Chef de projet, Entrepreneur...', required: false },
      { name: 'entreprisePersonne1', label: 'Votre entreprise/secteur', type: 'text', placeholder: 'Ex: Tech, Finance, Conseil...', required: false },
      { name: 'entreprisePersonne2', label: 'Entreprise/secteur du partenaire', type: 'text', placeholder: 'Ex: Startup, Grande entreprise...', required: false },
      { name: 'typeCollaboration', label: 'Type de collaboration', type: 'text', placeholder: 'Ex: Partenariat, Équipe, Client-fournisseur...', required: false },
    ],
  },
  'dates-optimales': {
    title: '📆 Choix de Dates Optimales',
    description: 'Trouvez les meilleures dates pour vos projets importants',
    icon: '📆',
    fields: [
      { name: 'typeEvenement', label: 'Type d\'événement', type: 'text', placeholder: 'Mariage, lancement, signature...', required: true },
      { name: 'periode', label: 'Période souhaitée', type: 'text', placeholder: 'Mars 2024 - Juin 2024', required: true },
    ],
  },
};

export default function StudyPage({ params }: { params: Promise<{ type: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resolvedParams = use(params);
  const studyType = resolvedParams.type as StudyType;
  const config = studyConfigs[studyType];

  // Récupérer les données de base depuis les query params
  useEffect(() => {
    const prenom = searchParams.get('prenom') || '';
    const nom = searchParams.get('nom') || '';
    const date = searchParams.get('date') || '';

    setFormData({
      prenom,
      nom,
      dateNaissance: date,
    });
  }, [searchParams]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Type d'étude non trouvé</div>
      </div>
    );
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation : seulement les champs requis
    const newErrors: Record<string, string> = {};
    config.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} est requis`;
      }
    });
    
    // Validation spéciale pour les compatibilités : prénom partenaire obligatoire
    if (studyType === 'compatibilite-amoureuse' || 
        studyType === 'compatibilite-business' || 
        studyType === 'compatibilite-familiale') {
      if (!formData.prenomPartenaire) {
        newErrors.prenomPartenaire = 'Le prénom est requis';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Préparer les données pour l'API
      const requestData: any = {
        prenom: formData.prenom,
        nom: formData.nom,
        dateNaissance: formData.dateNaissance,
      };

      // Ajouter les champs spécifiques selon le type d'étude
      config.fields.forEach((field) => {
        if (field.type === 'date' && formData[field.name]) {
          // Convertir la date HTML vers le format DD/MM/YYYY
          requestData[field.name] = convertirDateHTMLVersFormat(formData[field.name]);
        } else {
          requestData[field.name] = formData[field.name];
        }
      });

      // Appeler l'API
      const response = await fetch(`/api/etudes/${studyType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la génération de l\'étude');
      }

      // Sauvegarder les résultats dans localStorage et rediriger
      localStorage.setItem('derniereEtude', JSON.stringify({
        type: studyType,
        donnees: requestData,
        calculs: data.calculs,
        analyse: data.analyse,
      }));

      router.push(`/etudes/${studyType}/resultats`);
    } catch (error: any) {
      console.error('Erreur:', error);
      setErrors({ submit: error.message || 'Une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <StarsBackground />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-12">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{config.icon}</div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {config.title}
            </h1>
            <p className="text-lg text-gray-300">
              {config.description}
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/10 shadow-2xl shadow-purple-500/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Données de base (pré-remplies) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Prénom"
                  value={formData.prenom || ''}
                  onChange={handleChange('prenom')}
                  disabled
                  className="opacity-60"
                />
                <Input
                  label="Nom"
                  value={formData.nom || ''}
                  onChange={handleChange('nom')}
                  disabled
                  className="opacity-60"
                />
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={formData.dateNaissance ? convertirFormatVersDateHTML(formData.dateNaissance) : ''}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 opacity-60"
                  />
                </div>
              </div>

              {/* Champs spécifiques à l'étude */}
              {config.fields.length > 0 && (
                <>
                  <div className="border-t border-white/10 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Informations supplémentaires
                    </h3>
                    <div className="space-y-4">
                      {config.fields.map((field) => (
                        <div key={field.name}>
                          {field.type === 'date' ? (
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium text-gray-300">
                                {field.label}
                                {!field.required && (
                                  <span className="text-gray-500 text-xs ml-1">(optionnel)</span>
                                )}
                              </label>
                              <input
                                type="date"
                                value={formData[field.name] || ''}
                                onChange={handleChange(field.name)}
                                disabled={isLoading}
                                className={`
                                  w-full px-4 py-3 rounded-lg
                                  bg-white/10 backdrop-blur-sm
                                  border border-white/20
                                  text-white placeholder:text-gray-400
                                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                                  transition-all duration-200
                                  ${errors[field.name] ? 'border-red-500/50' : ''}
                                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                  [color-scheme:dark]
                                `}
                              />
                              {errors[field.name] && (
                                <span className="text-xs text-red-400">{errors[field.name]}</span>
                              )}
                            </div>
                          ) : (
                            <Input
                              label={field.label + (!field.required ? ' (optionnel)' : '')}
                              type={field.type}
                              value={formData[field.name] || ''}
                              onChange={handleChange(field.name)}
                              placeholder={field.placeholder}
                              error={errors[field.name]}
                              disabled={isLoading}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Message d'erreur global */}
              {errors.submit && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                  {errors.submit}
                </div>
              )}

              {/* Boutons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="flex-1"
                  disabled={isLoading}
                >
                  ← Retour
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Générer l'analyse →
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
