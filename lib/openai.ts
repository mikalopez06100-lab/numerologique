// Configuration et utilitaires pour l'API OpenAI
import { reduireNombre } from './numerologie';

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OpenAIRequest {
  prenom: string;
  nom: string;
  dateNaissance: string;
  cheminDeVie: number;
  nombreExpression: number;
  nombreIntime: number;
  detailsCheminDeVie: {
    jour: number;
    mois: number;
    annee: number;
    sommeAnnee: number;
    sommeJour: number;
    sommeMois: number;
    cheminDeVie: number;
  };
  detailsExpression: {
    lettres: Array<{ lettre: string; valeur: number }>;
    somme: number;
    nombreFinal: number;
  };
  detailsIntime: {
    lettres: Array<{ lettre: string; valeur: number }>;
    somme: number;
    nombreFinal: number;
  };
}

/**
 * Génère un prompt pour l'analyse numérologique via OpenAI
 */
export function genererPrompt(donnees: OpenAIRequest): string {
  // Construire les détails des lettres pour l'expression
  const lettresExpression = donnees.detailsExpression.lettres
    .map((l) => `${l.lettre}(${l.valeur})`)
    .join(' + ');
  
  // Construire les détails des lettres pour l'intime
  const lettresIntime = donnees.detailsIntime.lettres
    .map((l) => `${l.lettre}(${l.valeur})`)
    .join(' + ');

  // Calculer la somme réduite de l'année
  const sommeAnneeReduite = reduireNombre(donnees.detailsCheminDeVie.sommeAnnee);
  const sommeIntermediaire = donnees.detailsCheminDeVie.sommeJour + sommeAnneeReduite + donnees.detailsCheminDeVie.sommeMois;

  return `Tu es un expert en numérologie moderne. Tu vas créer une analyse numérologique PERSONNALISÉE et PERCUTANTE pour ${donnees.prenom}.

**INSTRUCTIONS IMPORTANTES :**
- Parle DIRECTEMENT à ${donnees.prenom} en utilisant "tu" et "ton/ta/tes"
- Utilise son prénom ${donnees.prenom} régulièrement dans l'analyse pour la personnaliser
- Sois DIRECT, CONCIS et IMPACTANT - évite les phrases longues et vagues
- Détaille sa PERSONNALITÉ de manière précise et concrète
- Utilise un ton chaleureux mais professionnel
- Évite le jargon ésotérique - reste accessible et pratique

**DONNÉES NUMÉROLOGIQUES :**

Prénom : ${donnees.prenom}
Nom : ${donnees.nom}
Date de naissance : ${donnees.dateNaissance}

**CALCULS :**

Chemin de vie (${donnees.cheminDeVie}) :
- Date : ${donnees.detailsCheminDeVie.jour}/${donnees.detailsCheminDeVie.mois}/${donnees.detailsCheminDeVie.annee}
- Jour ${donnees.detailsCheminDeVie.jour} → ${donnees.detailsCheminDeVie.sommeJour}
- Mois ${donnees.detailsCheminDeVie.mois} → ${donnees.detailsCheminDeVie.sommeMois}
- Année ${donnees.detailsCheminDeVie.annee} → ${donnees.detailsCheminDeVie.sommeAnnee} → ${reduireNombre(donnees.detailsCheminDeVie.sommeAnnee)}
- Total : ${donnees.detailsCheminDeVie.sommeJour} + ${sommeAnneeReduite} + ${donnees.detailsCheminDeVie.sommeMois} = ${sommeIntermediaire} → ${donnees.cheminDeVie}

Expression (${donnees.nombreExpression}) :
- ${donnees.prenom} ${donnees.nom} : ${lettresExpression}
- Total : ${donnees.detailsExpression.somme} → ${donnees.nombreExpression}

Intime (${donnees.nombreIntime}) :
- ${donnees.prenom} : ${lettresIntime}
- Total : ${donnees.detailsIntime.somme} → ${donnees.nombreIntime}

**STRUCTURE DE RÉPONSE (JSON strict) :**

{
  "introduction": "Un paragraphe court et percutant qui parle directement à ${donnees.prenom}. Présente la numérologie de manière simple et explique ce que cette analyse va révéler sur sa personnalité. Utilise 'tu' et mentionne son prénom.",
  "cheminDeVie": {
    "explicationCalcul": "Explique le calcul de manière simple et claire, étape par étape, en parlant directement à ${donnees.prenom}.",
    "signification": {
      "tendancesPersonnalite": "Décris la personnalité de ${donnees.prenom} de manière précise et concrète. Sois spécifique sur ses traits de caractère, sa façon d'être, ses comportements typiques. Utilise des exemples concrets.",
      "forcesNaturelles": "Ses forces et talents naturels, ce qu'il/elle fait naturellement bien. Sois concret et précis.",
      "defisRecurrents": "Les défis ou difficultés qu'il/elle rencontre régulièrement. Sois bienveillant mais direct.",
      "environnementFavorable": "Le type d'environnement (professionnel, personnel) où ${donnees.prenom} s'épanouit le mieux."
    }
  },
  "nombreExpression": {
    "explicationCalcul": "Explique simplement comment on calcule le nombre d'expression à partir de son nom complet.",
    "interpretation": {
      "maniereAgir": "Comment ${donnees.prenom} agit dans la vie, sa façon d'aborder les situations, son style. Sois précis et concret.",
      "talentsDominants": "Ses talents et capacités dominants, ce qu'il/elle excelle à faire. Donne des exemples concrets.",
      "postureRelationnelle": "Comment ${donnees.prenom} se comporte en relation avec les autres (personnel et professionnel). Sois spécifique."
    }
  },
  "nombreIntime": {
    "explicationCalcul": "Explique simplement le calcul du nombre intime à partir du prénom.",
    "interpretation": {
      "motivationsProfondes": "Ce qui motive vraiment ${donnees.prenom} au plus profond de lui/elle, ses besoins essentiels, ce qui le/la fait vibrer. Sois précis et personnel."
    }
  },
  "coherenceGlobale": {
    "analyse": "Analyse comment ces trois nombres (chemin de vie, expression, intime) s'harmonisent ou créent des tensions dans la personnalité de ${donnees.prenom}. Sois concret et utilise son prénom.",
    "axesDeveloppement": "Les domaines où ${donnees.prenom} devrait se développer pour s'épanouir pleinement. Sois concret et actionnable.",
    "leviersEvolution": "Les leviers concrets que ${donnees.prenom} peut activer pour évoluer et prendre de meilleures décisions."
  },
  "conclusion": {
    "synthese": "Une synthèse percutante du profil de ${donnees.prenom} qui résume l'essentiel. Utilise 'tu' et son prénom.",
    "conseilsOrientations": "Des conseils concrets et actionnables pour ${donnees.prenom} (personnel, professionnel, stratégique). Sois précis.",
    "perspectiveAvenir": "Une conclusion tournée vers l'avenir, positive et motivante pour ${donnees.prenom}, sans prédiction rigide."
  }
}

**RÈGLES STRICTES :**
- Parle TOUJOURS à ${donnees.prenom} avec "tu" et "ton/ta/tes"
- Utilise son prénom ${donnees.prenom} plusieurs fois dans chaque section
- Sois CONCIS et PERCUTANT - chaque phrase doit avoir de l'impact
- Détaille sa PERSONNALITÉ de manière précise et concrète
- Évite les phrases vagues ou génériques
- Réponds UNIQUEMENT avec le JSON, sans texte avant ou après.`;
}

/**
 * Appelle l'API OpenAI pour générer l'analyse
 * La fonction genererAnalyseOpenAI est définie plus bas avec surcharge
 */

/**
 * Génère une analyse OpenAI (surcharge pour accepter un prompt personnalisé)
 */
export async function genererAnalyseOpenAI(
  donnees: OpenAIRequest | { prompt: string },
  config: OpenAIConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('Clé API OpenAI non configurée');
  }

  try {
    // Si c'est un prompt personnalisé, l'utiliser directement
    // Sinon, générer le prompt à partir des données
    const prompt = 'prompt' in donnees 
      ? donnees.prompt 
      : genererPrompt(donnees as OpenAIRequest);
    
    console.log('📝 Prompt généré, longueur:', prompt.length);

    const requestBody = {
      model: config.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en numérologie moderne. Tu crées des analyses personnalisées, percutantes et directes. Tu parles toujours à la personne avec "tu" et utilises son prénom régulièrement. Tu détailles la personnalité de manière précise et concrète. Réponds toujours en format JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 4000,
      response_format: { type: 'json_object' },
    };

    console.log('🌐 Envoi de la requête à OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 Réponse reçue, status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur réponse OpenAI:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: { message: errorText } };
      }
      
      throw new Error(
        `Erreur API OpenAI (${response.status}): ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    console.log('✅ Données OpenAI parsées');
    
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      console.error('❌ Pas de contenu dans la réponse:', JSON.stringify(data, null, 2));
      throw new Error('Réponse OpenAI vide');
    }

    return content;
  } catch (error) {
    console.error('❌ Exception lors de l\'appel OpenAI:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur inconnue lors de l\'appel à OpenAI');
  }
}
