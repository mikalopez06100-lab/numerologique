import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getAnalysesByUserId } from '@/lib/firebase-db';

/**
 * Route de test pour vérifier le stockage des analyses
 * GET /api/test-analyse
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer l'email depuis les cookies
    const email = request.cookies.get('auth_email')?.value;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Utilisateur non trouvé',
        email,
      });
    }

    // Récupérer les analyses de l'utilisateur
    const analyses = await getAnalysesByUserId(user.id);

    return NextResponse.json({
      success: true,
      email,
      userId: user.id,
      analysesCount: analyses.length,
      analyses: analyses.map((a) => ({
        id: a.id,
        prenom: a.prenom,
        nom: a.nom,
        dateNaissance: a.dateNaissance,
        createdAt: a.createdAt.toISOString(),
        hasAnalyseData: !!a.analyseData,
        analyseDataLength: a.analyseData?.length || 0,
      })),
    });
  } catch (error) {
    console.error('Erreur lors du test:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
