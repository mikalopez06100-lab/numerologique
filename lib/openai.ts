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

  return `Tu es un expert en numérologie moderne, avec une approche analytique, structurée et pédagogique.

À partir des informations suivantes :
- Nom : ${donnees.nom}
- Prénom : ${donnees.prenom}
- Date de naissance : ${donnees.dateNaissance} (format JJ/MM/AAAA)

Ta mission est de générer une étude numérologique complète, claire et pertinente, destinée à un public adulte, curieux de développement personnel et de compréhension de soi.

Contraintes générales :
- Le ton doit être professionnel, sérieux et accessible
- Le texte doit expliquer les calculs étape par étape, de manière compréhensible
- Aucune référence mystique ou ésotérique excessive
- Approche pragmatique, orientée personnalité, potentiel, cycles de vie et axes de progression
- Langage fluide, structuré, crédible et utile

**Détails des calculs :**

Chemin de vie :
- Date : ${donnees.detailsCheminDeVie.jour}/${donnees.detailsCheminDeVie.mois}/${donnees.detailsCheminDeVie.annee}
- Jour réduit : ${donnees.detailsCheminDeVie.jour} → ${donnees.detailsCheminDeVie.sommeJour}
- Mois réduit : ${donnees.detailsCheminDeVie.mois} → ${donnees.detailsCheminDeVie.sommeMois}
- Année réduite : ${donnees.detailsCheminDeVie.annee} → ${donnees.detailsCheminDeVie.sommeAnnee} → ${reduireNombre(donnees.detailsCheminDeVie.sommeAnnee)}
- Chemin de vie : ${donnees.detailsCheminDeVie.sommeJour} + ${sommeAnneeReduite} + ${donnees.detailsCheminDeVie.sommeMois} = ${sommeIntermediaire} → ${donnees.cheminDeVie}

Nombre d'expression (${donnees.prenom} ${donnees.nom}) :
- Calcul : ${lettresExpression}
- Total : ${donnees.detailsExpression.somme}
- Réduction : ${donnees.detailsExpression.somme} → ${donnees.nombreExpression}

Nombre intime (${donnees.prenom}) :
- Calcul : ${lettresIntime}
- Total : ${donnees.detailsIntime.somme}
- Réduction : ${donnees.detailsIntime.somme} → ${donnees.nombreIntime}

Structure attendue (réponds en JSON strict) :

{
  "introduction": "Paragraphe synthétique présentant la numérologie, son objectif, et ce que permet de comprendre une étude basée sur l'identité et la date de naissance.",
  "cheminDeVie": {
    "explicationCalcul": "Explication précise du calcul étape par étape avec les détails intermédiaires",
    "signification": {
      "tendancesPersonnalite": "Grandes tendances de personnalité",
      "forcesNaturelles": "Forces naturelles",
      "defisRecurrents": "Défis récurrents",
      "environnementFavorable": "Type d'environnement favorable"
    }
  },
  "nombreExpression": {
    "explicationCalcul": "Explication du principe de conversion des lettres en valeurs numériques, le total obtenu et sa réduction",
    "interpretation": {
      "maniereAgir": "Manier d'agir",
      "talentsDominants": "Talents dominants",
      "postureRelationnelle": "Posture relationnelle et professionnelle"
    }
  },
  "nombreIntime": {
    "explicationCalcul": "Explication du calcul",
    "interpretation": {
      "motivationsProfondes": "Motivations profondes, besoins internes, moteurs inconscients"
    }
  },
  "coherenceGlobale": {
    "analyse": "Analyse de la cohérence ou des tensions entre le chemin de vie, le nombre d'expression et le nombre intime",
    "axesDeveloppement": "Grands axes de développement personnel",
    "leviersEvolution": "Leviers d'évolution et de prise de décision"
  },
  "conclusion": {
    "synthese": "Synthèse claire du profil numérologique",
    "conseilsOrientations": "Conseils concrets d'orientation (personnelle, professionnelle ou stratégique)",
    "perspectiveAvenir": "Conclusion tournée vers l'avenir, sans prédiction rigide"
  }
}

Important :
- Le contenu doit être original, structuré, sans phrases vagues
- Chaque partie doit apporter une vraie valeur d'analyse
- Aucune question ne doit être posée à l'utilisateur dans la réponse finale
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
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
          content: 'Tu es un expert en numérologie. Fournis des analyses détaillées, personnalisées et positives en français. Réponds toujours en format JSON valide.',
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
