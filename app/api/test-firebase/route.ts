import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import { getOrCreateUser } from '@/lib/firebase-db';

/**
 * Route de test pour vérifier la connexion Firebase
 * GET /api/test-firebase
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier les variables d'environnement
    const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
    const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;

    const configStatus = {
      FIREBASE_PROJECT_ID: hasProjectId ? '✅ Configuré' : '❌ Manquant',
      FIREBASE_CLIENT_EMAIL: hasClientEmail ? '✅ Configuré' : '❌ Manquant',
      FIREBASE_PRIVATE_KEY: hasPrivateKey ? '✅ Configuré' : '❌ Manquant',
    };

    // Tester la connexion Firebase
    let dbTest = 'Non testé';
    let userTest = 'Non testé';
    let errorDetails = null;

    try {
      const db = getDb();
      if (db) {
        dbTest = '✅ Connexion réussie';
        
        // Tester une opération simple
        try {
          const testUser = await getOrCreateUser('test@example.com');
          userTest = `✅ Utilisateur test créé/récupéré: ${testUser.id}`;
        } catch (userError) {
          userTest = `❌ Erreur lors de la création utilisateur: ${userError instanceof Error ? userError.message : 'Erreur inconnue'}`;
          errorDetails = userError instanceof Error ? userError.stack : String(userError);
        }
      } else {
        dbTest = '❌ Impossible d\'obtenir l\'instance Firestore';
      }
    } catch (dbError) {
      dbTest = `❌ Erreur Firebase: ${dbError instanceof Error ? dbError.message : 'Erreur inconnue'}`;
      errorDetails = dbError instanceof Error ? dbError.stack : String(dbError);
    }

    return NextResponse.json({
      success: true,
      config: configStatus,
      tests: {
        db: dbTest,
        user: userTest,
      },
      error: errorDetails,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
