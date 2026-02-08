import { NextRequest, NextResponse } from 'next/server';
import { FormulaireNumerologie } from '@/types/numerologie';
import {
  calculerCheminDeVie,
  calculerValeurNom,
  calculerDetailsCheminDeVie,
  calculerDetailsNom,
  validerDate,
} from '@/lib/numerologie';
import {
  genererAnalyseOpenAI,
  genererPrompt,
  OpenAIConfig,
} from '@/lib/openai';
import { checkRateLimit } from '@/lib/rateLimiter';
import { createAnalyse, updateAnalyse } from '@/lib/firebase-db';
import { hasUserAlreadyAnalyzed, getOrCreateUser } from '@/lib/auth';
import { generatePDF } from '@/lib/pdf';
import { sendAnalysisEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const email = request.cookies.get('auth_email')?.value;
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié. Veuillez vous connecter via email.' },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur a déjà fait une analyse
    const alreadyAnalyzed = await hasUserAlreadyAnalyzed(email);
    
    if (alreadyAnalyzed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Vous avez déjà effectué une analyse. Chaque email ne peut effectuer qu\'une seule analyse.' 
        },
        { status: 403 }
      );
    }

    // Vérifier les limites d'utilisation
    const rateLimitConfig = {
      maxCallsPerDay: parseInt(process.env.RATE_LIMIT_DAILY || '50'),
      maxCallsPerHour: parseInt(process.env.RATE_LIMIT_HOURLY || '10'),
      maxCallsPerMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '3'),
    };
    const rateLimitCheck = checkRateLimit(rateLimitConfig);
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitCheck.message || 'Limite d\'utilisation atteinte',
          rateLimit: rateLimitCheck.limits,
        },
        { status: 429 } // Too Many Requests
      );
    }

    const body: FormulaireNumerologie & { email?: string } = await request.json();

    // Validation des données
    if (!body.prenom || !body.nom || !body.dateNaissance) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (!validerDate(body.dateNaissance)) {
      return NextResponse.json(
        { success: false, error: 'Format de date invalide. Utilisez JJ/MM/AAAA' },
        { status: 400 }
      );
    }

    // Calculs numérologiques de base
    const cheminDeVie = calculerCheminDeVie(body.dateNaissance);
    const nomComplet = `${body.prenom} ${body.nom}`;
    const nombreExpression = calculerValeurNom(nomComplet);
    const nombreIntime = calculerValeurNom(body.prenom);

    // Calculs détaillés pour les explications
    const detailsCheminDeVie = calculerDetailsCheminDeVie(body.dateNaissance);
    const detailsExpression = calculerDetailsNom(nomComplet);
    const detailsIntime = calculerDetailsNom(body.prenom);

    // Préparation des données pour OpenAI
    const donneesOpenAI = {
      prenom: body.prenom,
      nom: body.nom,
      dateNaissance: body.dateNaissance,
      cheminDeVie,
      nombreExpression,
      nombreIntime,
      detailsCheminDeVie,
      detailsExpression,
      detailsIntime,
    };

    // Génération de l'analyse via OpenAI
    const openAIConfig: OpenAIConfig = {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
    };

    // Debug: Vérifier la configuration (sans logger la clé complète)
    console.log('🔍 Configuration OpenAI:');
    console.log('- Clé API présente:', openAIConfig.apiKey ? `Oui (${openAIConfig.apiKey.substring(0, 10)}...)` : 'NON');
    console.log('- Modèle:', openAIConfig.model);
    console.log('- Max tokens:', openAIConfig.maxTokens);

    let analyseText = '';
    
    if (openAIConfig.apiKey) {
      try {
        console.log('🚀 Appel à OpenAI en cours...');
        analyseText = await genererAnalyseOpenAI(donneesOpenAI, openAIConfig);
        console.log('✅ Réponse OpenAI reçue, longueur:', analyseText.length);
      } catch (error) {
        console.error('❌ Erreur OpenAI:', error);
        if (error instanceof Error) {
          console.error('Message d\'erreur:', error.message);
          
          // Détecter les erreurs de quota
          if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('billing')) {
            console.error('⚠️ Problème de quota/crédits OpenAI détecté');
            // On continue avec le fallback mais on pourrait aussi retourner une erreur spécifique
          }
        }
        // Fallback: analyse basique si OpenAI échoue
        console.log('⚠️ Utilisation de l\'analyse basique (fallback)');
        analyseText = genererAnalyseBasique(donneesOpenAI);
      }
    } else {
      // Analyse basique si OpenAI n'est pas configuré
      console.log('⚠️ Clé API OpenAI non trouvée, utilisation de l\'analyse basique');
      analyseText = genererAnalyseBasique(donneesOpenAI);
    }

    // Parsing de l'analyse
    const analyseParsed = parserAnalyse(analyseText, donneesOpenAI);

    // Réorganiser la structure pour éviter les conflits de noms
    const analyse = {
      ...analyseParsed,
      // Renommer les objets détaillés si présents
      ...(analyseParsed.cheminDeVie && typeof analyseParsed.cheminDeVie === 'object' && {
        cheminDeVieDetail: analyseParsed.cheminDeVie,
      }),
      ...(analyseParsed.nombreExpression && typeof analyseParsed.nombreExpression === 'object' && {
        nombreExpressionDetail: analyseParsed.nombreExpression,
      }),
      ...(analyseParsed.nombreIntime && typeof analyseParsed.nombreIntime === 'object' && {
        nombreIntimeDetail: analyseParsed.nombreIntime,
      }),
    };

    // Nettoyer les doublons et s'assurer que les valeurs numériques sont toujours présentes
    if (typeof analyse.cheminDeVie === 'object') {
      delete analyse.cheminDeVie;
    }
    if (typeof analyse.nombreExpression === 'object') {
      delete analyse.nombreExpression;
    }
    if (typeof analyse.nombreIntime === 'object') {
      delete analyse.nombreIntime;
    }
    
    // Réinsérer les valeurs numériques calculées (toujours présentes en haut de la page)
    analyse.cheminDeVie = cheminDeVie;
    analyse.nombreExpression = nombreExpression;
    analyse.nombreIntime = nombreIntime;

    // Créer ou récupérer l'utilisateur
    const user = await getOrCreateUser(email);

    const resultat = {
      id: `analyse-${Date.now()}`,
      dateCreation: new Date().toISOString(),
      donnees: body,
      analyse,
    };

    // Sauvegarder l'analyse dans la base de données Firebase
    const analyseDb = await createAnalyse({
      userId: user.id,
      prenom: body.prenom,
      nom: body.nom,
      dateNaissance: body.dateNaissance,
      cheminDeVie: cheminDeVie,
      nombreExpression: nombreExpression,
      nombreIntime: nombreIntime,
      analyseData: JSON.stringify(analyse),
    });

    // Générer le PDF
    let pdfBuffer: Buffer | null = null;
    let pdfGenerated = false;
    let emailSent = false;

    try {
      console.log('📄 Génération du PDF...');
      pdfBuffer = await generatePDF(resultat);
      pdfGenerated = true;
      console.log('✅ PDF généré avec succès');

      // Mettre à jour la base de données
      await updateAnalyse(analyseDb.id, { pdfGenerated: true });

      // Envoyer l'email avec le PDF
      console.log('📧 Envoi de l\'email avec le PDF...');
      emailSent = await sendAnalysisEmail(email, pdfBuffer, body.prenom, body.nom);
      
      if (emailSent) {
        await updateAnalyse(analyseDb.id, { emailSent: true });
        console.log('✅ Email envoyé avec succès');
      } else {
        console.warn('⚠️ Échec de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la génération du PDF ou de l\'envoi:', error);
      // On continue même si le PDF/email échoue
    }

    return NextResponse.json({
      success: true,
      data: {
        ...resultat,
        id: analyseDb.id,
        pdfGenerated,
        emailSent,
      },
      rateLimit: rateLimitCheck.limits,
    });
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}

/**
 * Génère une analyse basique si OpenAI n'est pas disponible
 */
function genererAnalyseBasique(donnees: any): string {
  return `
**Description générale:**
Votre profil numérologique révèle un chemin de vie ${donnees.cheminDeVie}, avec un nombre d'expression ${donnees.nombreExpression} et un nombre intime ${donnees.nombreIntime}. Ces nombres tracent votre destinée et révèlent vos talents innés.

**Points forts:**
- Capacité d'adaptation remarquable
- Intuition développée
- Sens de la communication
- Créativité naturelle

**Défis:**
- Apprendre à canaliser votre énergie
- Développer votre patience
- Équilibrer vos émotions

**Conseils:**
- Suivez votre intuition
- Cultivez votre créativité
- Restez ouvert aux opportunités
`;
}

/**
 * Parse l'analyse JSON en structure structurée
 */
function parserAnalyse(
  texte: string,
  donnees: any
): any {
  // Essayer de parser comme JSON d'abord
  try {
    // Nettoyer le texte pour extraire le JSON (enlever markdown code blocks si présent)
    let jsonText = texte.trim();
    
    // Enlever les code blocks markdown
    jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    const parsed = JSON.parse(jsonText);
    
    if (parsed && typeof parsed === 'object') {
      // Retourner la structure complète de l'analyse
      return parsed;
    }
  } catch (e) {
    console.error('Erreur lors du parsing JSON:', e);
    console.log('Texte reçu:', texte.substring(0, 500));
  }

  // Fallback: Structure basique si le parsing échoue
  return {
    introduction: 'Analyse numérologique en cours de génération...',
    cheminDeVie: {
      explicationCalcul: 'Calcul en cours',
      signification: {
        tendancesPersonnalite: 'En cours d\'analyse',
        forcesNaturelles: 'En cours d\'analyse',
        defisRecurrents: 'En cours d\'analyse',
        environnementFavorable: 'En cours d\'analyse',
      },
    },
    nombreExpression: {
      explicationCalcul: 'Calcul en cours',
      interpretation: {
        maniereAgir: 'En cours d\'analyse',
        talentsDominants: 'En cours d\'analyse',
        postureRelationnelle: 'En cours d\'analyse',
      },
    },
    nombreIntime: {
      explicationCalcul: 'Calcul en cours',
      interpretation: {
        motivationsProfondes: 'En cours d\'analyse',
      },
    },
    coherenceGlobale: {
      analyse: 'En cours d\'analyse',
      axesDeveloppement: 'En cours d\'analyse',
      leviersEvolution: 'En cours d\'analyse',
    },
    conclusion: {
      synthese: 'En cours d\'analyse',
      conseilsOrientations: 'En cours d\'analyse',
      perspectiveAvenir: 'En cours d\'analyse',
    },
  };
}
