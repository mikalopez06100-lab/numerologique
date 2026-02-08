import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, deleteAuthToken } from '@/lib/auth';

/**
 * Route pour vérifier un token d'authentification
 * GET /api/auth/verify?token=...
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token manquant' },
        { status: 400 }
      );
    }

    const email = verifyAuthToken(token);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Token invalide ou expiré' },
        { status: 401 }
      );
    }

    // Supprimer le token après utilisation
    deleteAuthToken(token);

    // Créer un cookie de session (ou JWT pour production)
    const response = NextResponse.json({
      success: true,
      email,
      message: 'Authentification réussie',
    });

    // Stocker l'email dans un cookie sécurisé
    response.cookies.set('auth_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
