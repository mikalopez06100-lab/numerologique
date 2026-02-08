import { NextRequest, NextResponse } from 'next/server';
import { hasUserAlreadyAnalyzed, createAuthToken, getOrCreateUser } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * Route pour enregistrer l'email et donner accès direct
 * POST /api/auth/send-email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Email invalide' },
        { status: 400 }
      );
    }

    try {
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

      // Créer ou récupérer l'utilisateur
      await getOrCreateUser(email);

      // Créer un token d'authentification
      const token = createAuthToken(email);

      // Définir les cookies d'authentification directement
      const cookieStore = await cookies();
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: '/',
      });
      cookieStore.set('auth_email', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: 'Email enregistré avec succès. Accès autorisé.',
        email: email,
      });
    } catch (dbError) {
      console.error('Erreur base de données:', dbError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur base de données: ' + (dbError instanceof Error ? dbError.message : 'Erreur inconnue'),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'email:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
