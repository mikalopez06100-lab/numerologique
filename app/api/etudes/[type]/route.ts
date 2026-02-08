import { NextRequest, NextResponse } from 'next/server';
import {
  calculerAnneePersonnelle,
  calculerCompatibilite,
  calculerPrevisions,
  calculerCheminDeVie,
  calculerValeurNom,
  validerDate,
  convertirDateHTMLVersFormat,
} from '@/lib/numerologie';
import {
  genererPromptAnneePersonnelle,
  genererPromptCompatibiliteAmoureuse,
  genererPromptCompatibiliteBusiness,
  genererPromptCompatibiliteFamiliale,
  genererPromptPrevisions,
  genererPromptDatesOptimales,
} from '@/lib/etudes-prompts';
import { genererAnalyseOpenAI, OpenAIConfig } from '@/lib/openai';
import { checkRateLimit } from '@/lib/rateLimiter';

type StudyType = 
  | 'annee-personnelle'
  | 'compatibilite-amoureuse'
  | 'compatibilite-familiale'
  | 'prevision-3-6-9-ans'
  | 'compatibilite-business'
  | 'dates-optimales';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const resolvedParams = await params;
    const studyType = resolvedParams.type as StudyType;

    // Vérifier l'authentification
    const email = request.cookies.get('auth_email')?.value;
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié. Veuillez vous connecter via email.' },
        { status: 401 }
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
        { status: 429 }
      );
    }

    const body = await request.json();

    // Configuration OpenAI
    const openaiConfig: OpenAIConfig = {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
    };

    if (!openaiConfig.apiKey) {
      return NextResponse.json(
        { success: false, error: 'Configuration OpenAI manquante' },
        { status: 500 }
      );
    }

    let prompt: string;
    let calculs: any;

    // Traitement selon le type d'étude
    switch (studyType) {
      case 'annee-personnelle': {
        const { prenom, nom, dateNaissance, annee } = body;

        if (!prenom || !nom || !dateNaissance || !annee) {
          return NextResponse.json(
            { success: false, error: 'Tous les champs sont requis' },
            { status: 400 }
          );
        }

        if (!validerDate(dateNaissance)) {
          return NextResponse.json(
            { success: false, error: 'Format de date invalide. Utilisez JJ/MM/AAAA' },
            { status: 400 }
          );
        }

        const anneeNum = parseInt(annee);
        if (isNaN(anneeNum) || anneeNum < 1900 || anneeNum > 2100) {
          return NextResponse.json(
            { success: false, error: 'Année invalide' },
            { status: 400 }
          );
        }

        calculs = calculerAnneePersonnelle(dateNaissance, anneeNum);
        prompt = genererPromptAnneePersonnelle({
          prenom,
          nom,
          dateNaissance,
          annee: anneeNum,
          ...calculs,
        });
        break;
      }

      case 'compatibilite-amoureuse':
      case 'compatibilite-business':
      case 'compatibilite-familiale': {
        const { 
          prenom, nom, dateNaissance,
          prenomPartenaire, nomPartenaire, dateNaissancePartenaire,
          relation,
          // Champs spécifiques business
          metierPersonne1, metierPersonne2,
          entreprisePersonne1, entreprisePersonne2,
          typeCollaboration
        } = body;

        // Validation : prénom obligatoire pour les deux personnes
        if (!prenom || !nom || !dateNaissance || !prenomPartenaire) {
          return NextResponse.json(
            { success: false, error: 'Le prénom du partenaire est requis. Le nom et la date de naissance sont optionnels pour plus de fiabilité.' },
            { status: 400 }
          );
        }

        // Validation de la date de naissance principale
        if (!validerDate(dateNaissance)) {
          return NextResponse.json(
            { success: false, error: 'Format de date invalide. Utilisez JJ/MM/AAAA' },
            { status: 400 }
          );
        }

        // Convertir la date du partenaire si elle est fournie et au format HTML
        let datePartenaire: string | undefined;
        if (dateNaissancePartenaire) {
          datePartenaire = dateNaissancePartenaire.includes('/') 
            ? dateNaissancePartenaire 
            : convertirDateHTMLVersFormat(dateNaissancePartenaire);
          
          if (!validerDate(datePartenaire)) {
            return NextResponse.json(
              { success: false, error: 'Format de date du partenaire invalide. Utilisez JJ/MM/AAAA' },
              { status: 400 }
            );
          }
        }

        calculs = calculerCompatibilite(
          { prenom, nom, dateNaissance },
          { 
            prenom: prenomPartenaire, 
            nom: nomPartenaire || undefined, 
            dateNaissance: datePartenaire 
          }
        );

        // Ajouter les informations professionnelles pour business
        if (studyType === 'compatibilite-business') {
          calculs.personne1.metier = metierPersonne1;
          calculs.personne1.entreprise = entreprisePersonne1;
          calculs.personne2.metier = metierPersonne2;
          calculs.personne2.entreprise = entreprisePersonne2;
          calculs.typeCollaboration = typeCollaboration;
        }

        // Ajouter la relation si fournie (pour compatibilité familiale)
        if (relation) {
          calculs.relation = relation;
        }

        if (studyType === 'compatibilite-amoureuse') {
          prompt = genererPromptCompatibiliteAmoureuse(calculs);
        } else if (studyType === 'compatibilite-familiale') {
          prompt = genererPromptCompatibiliteFamiliale(calculs);
        } else {
          prompt = genererPromptCompatibiliteBusiness(calculs);
        }
        break;
      }

      case 'prevision-3-6-9-ans': {
        const { prenom, nom, dateNaissance } = body;

        if (!prenom || !nom || !dateNaissance) {
          return NextResponse.json(
            { success: false, error: 'Tous les champs sont requis' },
            { status: 400 }
          );
        }

        if (!validerDate(dateNaissance)) {
          return NextResponse.json(
            { success: false, error: 'Format de date invalide. Utilisez JJ/MM/AAAA' },
            { status: 400 }
          );
        }

        // Utiliser l'année actuelle comme référence
        const anneeReference = new Date().getFullYear();
        calculs = calculerPrevisions(dateNaissance, anneeReference);
        prompt = genererPromptPrevisions({
          prenom,
          nom,
          dateNaissance,
          ...calculs,
        });
        break;
      }

      case 'dates-optimales': {
        const { prenom, nom, dateNaissance, typeEvenement, periode } = body;

        if (!prenom || !nom || !dateNaissance || !typeEvenement || !periode) {
          return NextResponse.json(
            { success: false, error: 'Tous les champs sont requis' },
            { status: 400 }
          );
        }

        if (!validerDate(dateNaissance)) {
          return NextResponse.json(
            { success: false, error: 'Format de date invalide. Utilisez JJ/MM/AAAA' },
            { status: 400 }
          );
        }

        const cheminDeVie = calculerCheminDeVie(dateNaissance);
        prompt = genererPromptDatesOptimales({
          prenom,
          nom,
          dateNaissance,
          cheminDeVie,
          typeEvenement,
          periode,
        });
        calculs = { cheminDeVie };
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Type d\'étude non reconnu' },
          { status: 400 }
        );
    }

    // Générer l'analyse via OpenAI
    const analyseJson = await genererAnalyseOpenAI(
      { prompt },
      openaiConfig
    );

    // Parser la réponse JSON
    let analyseParsed;
    try {
      analyseParsed = JSON.parse(analyseJson);
    } catch (error) {
      console.error('Erreur lors du parsing de la réponse OpenAI:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la génération de l\'analyse' },
        { status: 500 }
      );
    }

    // Retourner la réponse
    return NextResponse.json({
      success: true,
      type: studyType,
      calculs,
      analyse: analyseParsed,
    });

  } catch (error: any) {
    console.error('Erreur lors de la génération de l\'étude:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erreur lors de la génération de l\'étude' 
      },
      { status: 500 }
    );
  }
}
