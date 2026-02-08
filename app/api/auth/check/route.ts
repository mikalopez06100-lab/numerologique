import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

/**
 * Route pour vérifier si l'utilisateur est authentifié
 * GET /api/auth/check
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier d'abord le cookie auth_email (méthode directe)
    const emailFromCookie = request.cookies.get('auth_email')?.value;
    
    if (emailFromCookie) {
      return NextResponse.json({
        authenticated: true,
        email: emailFromCookie,
      });
    }

    // Sinon, vérifier le token
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    // Vérifier le token
    const email = verifyAuthToken(token);

    if (!email) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      email,
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
