import { NextResponse } from 'next/server';
import { genererAnalyseOpenAI, OpenAIConfig } from '@/lib/openai';

/**
 * Route de test pour tester directement l'appel OpenAI
 * Accès: GET /api/test-openai-call
 */
export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Clé API non configurée',
      }, { status: 500 });
    }

    const config: OpenAIConfig = {
      apiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
    };

    // Test avec des données minimales
    const testData = {
      prenom: 'Jean',
      nom: 'Dupont',
      dateNaissance: '15/03/1990',
      cheminDeVie: 5,
      nombreExpression: 3,
      nombreIntime: 2,
      detailsCheminDeVie: {
        jour: 15,
        mois: 3,
        annee: 1990,
        sommeAnnee: 19,
        sommeJour: 6,
        sommeMois: 3,
        cheminDeVie: 5,
      },
      detailsExpression: {
        lettres: [{ lettre: 'J', valeur: 10 }, { lettre: 'E', valeur: 5 }],
        somme: 50,
        nombreFinal: 5,
      },
      detailsIntime: {
        lettres: [{ lettre: 'J', valeur: 10 }, { lettre: 'E', valeur: 5 }],
        somme: 30,
        nombreFinal: 3,
      },
    };

    console.log('🧪 Test d\'appel OpenAI...');
    const result = await genererAnalyseOpenAI(testData, config);
    
    return NextResponse.json({
      success: true,
      message: 'Appel OpenAI réussi !',
      resultLength: result.length,
      resultPreview: result.substring(0, 200) + '...',
    });
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
