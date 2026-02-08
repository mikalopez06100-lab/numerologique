import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getAnalysesByUserId } from '@/lib/firebase-db';

/**
 * Route pour vérifier si l'utilisateur connecté a déjà une analyse
 * GET /api/analyse/has-analyse
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer l'email depuis les cookies
    const email = request.cookies.get('auth_email')?.value;

    if (!email) {
      return NextResponse.json(
        { success: false, hasAnalyse: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: true, hasAnalyse: false },
        { status: 200 }
      );
    }

    // Vérifier si l'utilisateur a des analyses
    const analyses = await getAnalysesByUserId(user.id);

    return NextResponse.json({
      success: true,
      hasAnalyse: analyses.length > 0,
    });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'analyse:', error);
    return NextResponse.json(
      {
        success: false,
        hasAnalyse: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
