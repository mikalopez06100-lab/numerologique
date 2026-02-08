// Prompts pour les différentes études numérologiques

import { reduireNombre } from './numerologie';

export interface AnneePersonnelleData {
  prenom: string;
  nom: string;
  dateNaissance: string;
  annee: number;
  cheminDeVie: number;
  anneeUniverselle: number;
  anneePersonnelle: number;
  details: {
    sommeAnnee: number;
    anneeUniverselleReduite: number;
  };
}

export interface CompatibiliteData {
  personne1: {
    prenom: string;
    nom?: string;
    dateNaissance?: string;
    cheminDeVie: number | null;
    nombreExpression: number;
    nombreIntime: number;
    metier?: string;
    entreprise?: string;
  };
  personne2: {
    prenom: string;
    nom?: string;
    dateNaissance?: string;
    cheminDeVie: number | null;
    nombreExpression: number;
    nombreIntime: number;
    metier?: string;
    entreprise?: string;
  };
  compatibilite: {
    cheminDeVie: number | null;
    expression: number;
    intime: number;
    scoreGlobal: number;
  };
  relation?: string; // Pour la compatibilité familiale
  typeCollaboration?: string; // Pour la compatibilité business
}

export interface PrevisionData {
  prenom: string;
  nom: string;
  dateNaissance: string;
  anneeReference: number;
  annee3: { annee: number; anneePersonnelle: number };
  annee6: { annee: number; anneePersonnelle: number };
  annee9: { annee: number; anneePersonnelle: number };
}

export interface DateOptimaleData {
  prenom: string;
  nom: string;
  dateNaissance: string;
  cheminDeVie: number;
  typeEvenement: string;
  periode: string;
}

/**
 * Génère le prompt pour l'année personnelle avec détail mois par mois
 */
export function genererPromptAnneePersonnelle(donnees: AnneePersonnelleData): string {
  return `Tu es un expert en numérologie moderne, avec une approche analytique, structurée et pédagogique.

À partir des informations suivantes :
- Nom : ${donnees.nom}
- Prénom : ${donnees.prenom}
- Date de naissance : ${donnees.dateNaissance} (format JJ/MM/AAAA)
- Année à analyser : ${donnees.annee}

**Calculs numérologiques :**
- Chemin de vie : ${donnees.cheminDeVie}
- Année universelle ${donnees.annee} : ${donnees.details.sommeAnnee} → ${donnees.anneeUniverselle}
- Année personnelle : ${donnees.cheminDeVie} + ${donnees.anneeUniverselle} = ${donnees.anneePersonnelle}

Ta mission est de générer une analyse complète de l'année personnelle ${donnees.annee}, avec un détail mois par mois.

Contraintes générales :
- Le ton doit être professionnel, sérieux et accessible
- Le texte doit expliquer les calculs étape par étape
- Aucune référence mystique ou ésotérique excessive
- Approche pragmatique, orientée opportunités, défis et axes de progression
- Langage fluide, structuré, crédible et utile

Structure attendue (réponds en JSON strict) :

{
  "introduction": "Paragraphe présentant l'année personnelle ${donnees.annee} et ce qu'elle représente pour cette personne",
  "anneePersonnelle": {
    "explicationCalcul": "Explication détaillée du calcul de l'année personnelle",
    "signification": {
      "themes": "Thèmes principaux de l'année",
      "opportunites": "Opportunités à saisir",
      "defis": "Défis à surmonter",
      "energie": "Type d'énergie dominante"
    }
  },
  "mois": [
    {
      "mois": "Janvier",
      "nombre": 1,
      "themes": "Thèmes du mois",
      "conseils": "Conseils pour ce mois"
    },
    {
      "mois": "Février",
      "nombre": 2,
      "themes": "Thèmes du mois",
      "conseils": "Conseils pour ce mois"
    }
    // ... pour les 12 mois
  ],
  "conclusion": {
    "synthese": "Synthèse de l'année",
    "recommandations": "Recommandations pour maximiser les opportunités de l'année"
  }
}

Important :
- Le contenu doit être original, structuré, sans phrases vagues
- Chaque mois doit avoir une analyse spécifique et pertinente
- Aucune question ne doit être posée à l'utilisateur dans la réponse finale
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
}

/**
 * Génère le prompt pour la compatibilité amoureuse
 */
export function genererPromptCompatibiliteAmoureuse(donnees: CompatibiliteData): string {
  const personne1Info = [
    `- Prénom : ${donnees.personne1.prenom}`,
    donnees.personne1.nom ? `- Nom : ${donnees.personne1.nom}` : '',
    donnees.personne1.dateNaissance ? `- Date de naissance : ${donnees.personne1.dateNaissance}` : '',
    donnees.personne1.cheminDeVie !== null ? `- Chemin de vie : ${donnees.personne1.cheminDeVie}` : '- Chemin de vie : Non disponible (date de naissance manquante)',
    `- Nombre d'expression : ${donnees.personne1.nombreExpression}`,
    `- Nombre intime : ${donnees.personne1.nombreIntime}`,
  ].filter(Boolean).join('\n');

  const personne2Info = [
    `- Prénom : ${donnees.personne2.prenom}`,
    donnees.personne2.nom ? `- Nom : ${donnees.personne2.nom}` : '',
    donnees.personne2.dateNaissance ? `- Date de naissance : ${donnees.personne2.dateNaissance}` : '',
    donnees.personne2.cheminDeVie !== null ? `- Chemin de vie : ${donnees.personne2.cheminDeVie}` : '- Chemin de vie : Non disponible (date de naissance manquante)',
    `- Nombre d'expression : ${donnees.personne2.nombreExpression}`,
    `- Nombre intime : ${donnees.personne2.nombreIntime}`,
  ].filter(Boolean).join('\n');

  const compatibiliteInfo = [
    donnees.compatibilite.cheminDeVie !== null ? `- Différence chemin de vie : ${donnees.compatibilite.cheminDeVie}` : '- Chemin de vie : Non calculable (données manquantes)',
    `- Différence expression : ${donnees.compatibilite.expression}`,
    `- Différence intime : ${donnees.compatibilite.intime}`,
    `- Score global : ${donnees.compatibilite.scoreGlobal}/9 (0 = très compatible, 9 = moins compatible)`,
  ].filter(Boolean).join('\n');

  return `Tu es un expert en numérologie moderne, spécialisé dans l'analyse de compatibilité amoureuse.

**Personne 1 :**
${personne1Info}

**Personne 2 :**
${personne2Info}

**Analyse de compatibilité :**
${compatibiliteInfo}

Ta mission est de générer une analyse complète de la compatibilité amoureuse entre ces deux personnes.

Contraintes générales :
- Le ton doit être professionnel, bienveillant et constructif
- Mettre l'accent sur les complémentarités et les points d'attention
- Aucune prédiction négative ou fataliste
- Approche pragmatique, orientée compréhension mutuelle et croissance du couple
- Langage fluide, structuré, crédible et utile

Structure attendue (réponds en JSON strict) :

{
  "introduction": "Paragraphe présentant l'analyse de compatibilité amoureuse",
  "analyseGlobale": {
    "score": ${donnees.compatibilite.scoreGlobal},
    "evaluation": "Évaluation générale de la compatibilité (excellent, bon, moyen, etc.)",
    "pointsForts": "Points forts de cette union",
    "pointsAttention": "Points nécessitant de l'attention et de la communication"
  },
  "compatibiliteCheminDeVie": {
    "analyse": "Analyse de la compatibilité des chemins de vie",
    "complementarite": "Comment les chemins de vie se complètent"
  },
  "compatibiliteExpression": {
    "analyse": "Analyse de la compatibilité des expressions (manière d'agir)",
    "dynamique": "Dynamique relationnelle créée"
  },
  "compatibiliteIntime": {
    "analyse": "Analyse de la compatibilité des nombres intimes (motivations profondes)",
    "harmonie": "Niveau d'harmonie des besoins profonds"
  },
  "conseils": {
    "communication": "Conseils pour améliorer la communication",
    "croissance": "Axes de croissance pour le couple",
    "momentsFavorables": "Types de moments favorables pour cette union"
  },
  "conclusion": {
    "synthese": "Synthèse de la compatibilité",
    "perspective": "Perspective d'avenir pour ce couple"
  }
}

Important :
- Le contenu doit être original, structuré, sans phrases vagues
- Toujours rester positif et constructif
- Aucune question ne doit être posée à l'utilisateur dans la réponse finale
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
}

/**
 * Génère le prompt pour la compatibilité business/pro
 */
export function genererPromptCompatibiliteBusiness(donnees: CompatibiliteData): string {
  return `Tu es un expert en numérologie moderne, spécialisé dans l'analyse de compatibilité professionnelle.

**Personne 1 :**
- Nom : ${donnees.personne1.nom}
- Prénom : ${donnees.personne1.prenom}
- Date de naissance : ${donnees.personne1.dateNaissance}
- Chemin de vie : ${donnees.personne1.cheminDeVie}
- Nombre d'expression : ${donnees.personne1.nombreExpression}
- Nombre intime : ${donnees.personne1.nombreIntime}

**Personne 2 :**
- Nom : ${donnees.personne2.nom}
- Prénom : ${donnees.personne2.prenom}
- Date de naissance : ${donnees.personne2.dateNaissance}
- Chemin de vie : ${donnees.personne2.cheminDeVie}
- Nombre d'expression : ${donnees.personne2.nombreExpression}
- Nombre intime : ${donnees.personne2.nombreIntime}

**Analyse de compatibilité :**
- Différence chemin de vie : ${donnees.compatibilite.cheminDeVie}
- Différence expression : ${donnees.compatibilite.expression}
- Différence intime : ${donnees.compatibilite.intime}
- Score global : ${donnees.compatibilite.scoreGlobal}/9

Ta mission est de générer une analyse complète de la compatibilité professionnelle/business entre ces deux personnes${donnees.typeCollaboration ? ` dans le contexte d'une collaboration de type "${donnees.typeCollaboration}"` : ''}.

Contraintes générales :
- Le ton doit être professionnel, factuel et orienté résultats
- Mettre l'accent sur les complémentarités professionnelles et les synergies
- ${donnees.personne1.metier || donnees.personne2.metier ? 'Prendre en compte les métiers et secteurs d\'activité mentionnés pour enrichir l\'analyse' : ''}
- Approche pragmatique, orientée efficacité, productivité et réussite professionnelle
- Langage fluide, structuré, crédible et utile

Structure attendue (réponds en JSON strict) :

{
  "introduction": "Paragraphe présentant l'analyse de compatibilité professionnelle",
  "analyseGlobale": {
    "score": ${donnees.compatibilite.scoreGlobal},
    "evaluation": "Évaluation générale de la compatibilité professionnelle",
    "pointsForts": "Points forts de cette collaboration",
    "pointsAttention": "Points nécessitant de l'attention dans la collaboration"
  },
  "compatibiliteCheminDeVie": {
    "analyse": "Analyse de la compatibilité des chemins de vie dans un contexte professionnel",
    "synergie": "Synergie professionnelle créée"
  },
  "compatibiliteExpression": {
    "analyse": "Analyse de la compatibilité des expressions (styles de travail)",
    "dynamique": "Dynamique professionnelle créée"
  },
  "compatibiliteIntime": {
    "analyse": "Analyse de la compatibilité des motivations profondes en contexte professionnel",
    "harmonie": "Niveau d'harmonie des objectifs professionnels"
  },
  "conseils": {
    "collaboration": "Conseils pour optimiser la collaboration${donnees.typeCollaboration ? ` dans le contexte ${donnees.typeCollaboration}` : ''}",
    "roles": "Suggestion de rôles et responsabilités${donnees.personne1.metier && donnees.personne2.metier ? ` en tenant compte des métiers (${donnees.personne1.metier} et ${donnees.personne2.metier})` : ''}",
    "communication": "Conseils pour la communication professionnelle",
    "environnement": "${donnees.personne1.entreprise || donnees.personne2.entreprise ? 'Recommandations sur l\'environnement de travail optimal en tenant compte des secteurs/entreprises mentionnés' : 'Recommandations sur l\'environnement de travail optimal'}"
  },
  "conclusion": {
    "synthese": "Synthèse de la compatibilité professionnelle",
    "recommandations": "Recommandations pour maximiser le succès de cette collaboration"
  }
}

Important :
- Le contenu doit être original, structuré, sans phrases vagues
- Toujours rester positif et orienté solutions
- Aucune question ne doit être posée à l'utilisateur dans la réponse finale
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
}

/**
 * Génère le prompt pour les prévisions 3/6/9 ans
 */
export function genererPromptPrevisions(donnees: PrevisionData): string {
  return `Tu es un expert en numérologie moderne, spécialisé dans l'analyse des cycles de vie.

**Informations de base :**
- Nom : ${donnees.nom}
- Prénom : ${donnees.prenom}
- Date de naissance : ${donnees.dateNaissance}
- Année de référence : ${donnees.anneeReference}

**Prévisions numérologiques :**

**Année +3 ans (${donnees.annee3.annee}) :**
- Année personnelle : ${donnees.annee3.anneePersonnelle}

**Année +6 ans (${donnees.annee6.annee}) :**
- Année personnelle : ${donnees.annee6.anneePersonnelle}

**Année +9 ans (${donnees.annee9.annee}) :**
- Année personnelle : ${donnees.annee9.anneePersonnelle}

Ta mission est de générer une analyse complète des prévisions sur 3, 6 et 9 ans, en expliquant les cycles de vie et les tendances.

Contraintes générales :
- Le ton doit être professionnel, prospectif et constructif
- Mettre l'accent sur les opportunités et les axes de développement
- Aucune prédiction négative ou fataliste
- Approche pragmatique, orientée préparation et anticipation
- Langage fluide, structuré, crédible et utile

Structure attendue (réponds en JSON strict) :

{
  "introduction": "Paragraphe présentant l'analyse des cycles de vie sur 3, 6 et 9 ans",
  "prevision3Ans": {
    "annee": ${donnees.annee3.annee},
    "anneePersonnelle": ${donnees.annee3.anneePersonnelle},
    "themes": "Thèmes principaux de cette période",
    "opportunites": "Opportunités à saisir",
    "defis": "Défis à anticiper",
    "recommandations": "Recommandations pour cette période"
  },
  "prevision6Ans": {
    "annee": ${donnees.annee6.annee},
    "anneePersonnelle": ${donnees.annee6.anneePersonnelle},
    "themes": "Thèmes principaux de cette période",
    "opportunites": "Opportunités à saisir",
    "defis": "Défis à anticiper",
    "recommandations": "Recommandations pour cette période"
  },
  "prevision9Ans": {
    "annee": ${donnees.annee9.annee},
    "anneePersonnelle": ${donnees.annee9.anneePersonnelle},
    "themes": "Thèmes principaux de cette période",
    "opportunites": "Opportunités à saisir",
    "defis": "Défis à anticiper",
    "recommandations": "Recommandations pour cette période"
  },
  "analyseGlobale": {
    "evolution": "Évolution globale sur les 9 ans",
    "cycles": "Analyse des cycles et de leur progression",
    "synergie": "Synergie entre les trois périodes"
  },
  "conclusion": {
    "synthese": "Synthèse des prévisions",
    "conseils": "Conseils pour préparer et optimiser ces périodes"
  }
}

Important :
- Le contenu doit être original, structuré, sans phrases vagues
- Toujours rester positif et orienté opportunités
- Aucune question ne doit être posée à l'utilisateur dans la réponse finale
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
}

/**
 * Génère le prompt pour le choix de dates optimales
 */
export function genererPromptDatesOptimales(donnees: DateOptimaleData): string {
  return `Tu es un expert en numérologie moderne, spécialisé dans le choix de dates optimales.

**Informations :**
- Nom : ${donnees.nom}
- Prénom : ${donnees.prenom}
- Date de naissance : ${donnees.dateNaissance}
- Chemin de vie : ${donnees.cheminDeVie}
- Type d'événement : ${donnees.typeEvenement}
- Période souhaitée : ${donnees.periode}

Ta mission est de générer une analyse pour identifier les dates optimales dans la période indiquée, en fonction du profil numérologique.

Contraintes générales :
- Le ton doit être professionnel, pratique et orienté résultats
- Expliquer comment les dates sont choisies en fonction de la numérologie
- Approche pragmatique, orientée optimisation et succès de l'événement
- Langage fluide, structuré, crédible et utile

Structure attendue (réponds en JSON strict) :

{
  "introduction": "Paragraphe présentant l'analyse pour le choix de dates optimales",
  "criteres": {
    "explication": "Explication des critères numérologiques utilisés",
    "methodologie": "Méthodologie de sélection des dates"
  },
  "datesOptimales": [
    {
      "date": "DD/MM/YYYY",
      "nombreJour": 5,
      "justification": "Pourquoi cette date est optimale",
      "energie": "Type d'énergie de cette date",
      "recommandation": "Recommandation spécifique pour cette date"
    }
    // Minimum 3-5 dates optimales
  ],
  "datesAEviter": [
    {
      "date": "DD/MM/YYYY",
      "raison": "Pourquoi cette date est à éviter"
    }
  ],
  "conseils": {
    "preparation": "Conseils pour préparer l'événement",
    "momentsFavorables": "Moments favorables dans les dates choisies"
  },
  "conclusion": {
    "synthese": "Synthèse des recommandations",
    "recommandationFinale": "Recommandation finale pour la date optimale"
  }
}

Important :
- Le contenu doit être original, structuré, sans phrases vagues
- Fournir des dates concrètes dans la période indiquée
- Aucune question ne doit être posée à l'utilisateur dans la réponse finale
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
}

/**
 * Génère le prompt pour la compatibilité familiale
 */
export function genererPromptCompatibiliteFamiliale(donnees: CompatibiliteData): string {
  const personne1Info = [
    `- Prénom : ${donnees.personne1.prenom}`,
    donnees.personne1.nom ? `- Nom : ${donnees.personne1.nom}` : '',
    donnees.personne1.dateNaissance ? `- Date de naissance : ${donnees.personne1.dateNaissance}` : '',
    donnees.personne1.cheminDeVie !== null ? `- Chemin de vie : ${donnees.personne1.cheminDeVie}` : '- Chemin de vie : Non disponible (date de naissance manquante)',
    `- Nombre d'expression : ${donnees.personne1.nombreExpression}`,
    `- Nombre intime : ${donnees.personne1.nombreIntime}`,
  ].filter(Boolean).join('\n');

  const personne2Info = [
    `- Prénom : ${donnees.personne2.prenom}`,
    donnees.personne2.nom ? `- Nom : ${donnees.personne2.nom}` : '',
    donnees.personne2.dateNaissance ? `- Date de naissance : ${donnees.personne2.dateNaissance}` : '',
    donnees.personne2.cheminDeVie !== null ? `- Chemin de vie : ${donnees.personne2.cheminDeVie}` : '- Chemin de vie : Non disponible (date de naissance manquante)',
    `- Nombre d'expression : ${donnees.personne2.nombreExpression}`,
    `- Nombre intime : ${donnees.personne2.nombreIntime}`,
  ].filter(Boolean).join('\n');

  const compatibiliteInfo = [
    donnees.compatibilite.cheminDeVie !== null ? `- Différence chemin de vie : ${donnees.compatibilite.cheminDeVie}` : '- Chemin de vie : Non calculable (données manquantes)',
    `- Différence expression : ${donnees.compatibilite.expression}`,
    `- Différence intime : ${donnees.compatibilite.intime}`,
    `- Score global : ${donnees.compatibilite.scoreGlobal}/9 (0 = très compatible, 9 = moins compatible)`,
  ].filter(Boolean).join('\n');

  const relationInfo = donnees.relation ? `\n**Relation :** ${donnees.relation}` : '';

  return `Tu es un expert en numérologie moderne, spécialisé dans l'analyse de compatibilité familiale.

**Personne 1 :**
${personne1Info}

**Personne 2 :**
${personne2Info}${relationInfo}

**Analyse de compatibilité :**
${compatibiliteInfo}

Ta mission est de générer une analyse complète de la compatibilité familiale entre ces deux personnes.

Contraintes générales :
- Le ton doit être professionnel, bienveillant et constructif
- Mettre l'accent sur la compréhension mutuelle et les dynamiques familiales
- Adapter l'analyse selon la relation (parent-enfant, frère-sœur, etc.)
- Aucune prédiction négative ou fataliste
- Approche pragmatique, orientée harmonie familiale et communication
- Langage fluide, structuré, crédible et utile

Structure attendue (réponds en JSON strict) :

{
  "introduction": "Paragraphe présentant l'analyse de compatibilité familiale${donnees.relation ? ` dans le contexte d'une relation ${donnees.relation}` : ''}"`,
  "analyseGlobale": {
    "score": ${donnees.compatibilite.scoreGlobal},
    "evaluation": "Évaluation générale de la compatibilité familiale",
    "pointsForts": "Points forts de cette relation familiale",
    "pointsAttention": "Points nécessitant de l'attention pour améliorer la relation"
  },
  "compatibiliteCheminDeVie": {
    "analyse": "Analyse de la compatibilité des chemins de vie dans un contexte familial${donnees.compatibilite.cheminDeVie === null ? ' (note: calcul non disponible, données manquantes)' : ''}",
    "dynamique": "Dynamique familiale créée par ces chemins de vie"
  },
  "compatibiliteExpression": {
    "analyse": "Analyse de la compatibilité des expressions (manière d'agir) dans la famille",
    "communication": "Style de communication et d'interaction"
  },
  "compatibiliteIntime": {
    "analyse": "Analyse de la compatibilité des nombres intimes (motivations profondes) en contexte familial",
    "harmonie": "Niveau d'harmonie des besoins profonds dans la relation familiale"
  },
  "conseils": {
    "communication": "Conseils pour améliorer la communication familiale",
    "comprehension": "Comment mieux se comprendre mutuellement",
    "momentsFavorables": "Types de moments favorables pour cette relation familiale"
  },
  "conclusion": {
    "synthese": "Synthèse de la compatibilité familiale",
    "perspective": "Perspective d'évolution de cette relation familiale"
  }
}

Important :
- Le contenu doit être original, structuré, sans phrases vagues
- Toujours rester positif et constructif
- Adapter le langage selon la relation (parent-enfant, frère-sœur, etc.)
- Aucune question ne doit être posée à l'utilisateur dans la réponse finale
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
}
