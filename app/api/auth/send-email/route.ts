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
      // Vérifier la configuration Firebase
      if (!process.env.FIREBASE_PROJECT_ID) {
        console.error('❌ FIREBASE_PROJECT_ID non configuré');
        return NextResponse.json(
          {
            success: false,
            error: 'Configuration Firebase manquante. Veuillez contacter le support.',
          },
          { status: 500 }
        );
      }

      // Vérifier si l'utilisateur a déjà fait une analyse
      let alreadyAnalyzed = false;
      try {
        alreadyAnalyzed = await hasUserAlreadyAnalyzed(email);
      } catch (error) {
        console.error('❌ Erreur lors de la vérification hasUserAlreadyAnalyzed:', error);
        // Si c'est une erreur Firebase, on continue quand même pour créer l'utilisateur
        // mais on log l'erreur
      }
      
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
      let user;
      try {
        user = await getOrCreateUser(email);
        console.log('✅ Utilisateur créé/récupéré:', user.id);
      } catch (error) {
        console.error('❌ Erreur lors de la création/récupération de l\'utilisateur:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        
        // Vérifier si c'est une erreur Firebase
        if (errorMessage.includes('Firebase') || errorMessage.includes('Firestore')) {
          return NextResponse.json(
            {
              success: false,
              error: 'Erreur de connexion à la base de données. Veuillez réessayer dans quelques instants.',
            },
            { status: 500 }
          );
        }
        
        throw error; // Relancer l'erreur si ce n'est pas Firebase
      }

      // Créer un token d'authentification
      const token = createAuthToken(email);

      // Définir les cookies d'authentification directement
      try {
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
        console.log('✅ Cookies d\'authentification définis');
      } catch (cookieError) {
        console.error('❌ Erreur lors de la définition des cookies:', cookieError);
        // On continue quand même, les cookies peuvent échouer mais l'utilisateur est créé
      }

      return NextResponse.json({
        success: true,
        message: 'Email enregistré avec succès. Accès autorisé.',
        email: email,
      });
    } catch (dbError) {
      console.error('❌ Erreur base de données:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Erreur inconnue';
      
      // Message d'erreur plus détaillé pour le débogage
      let userMessage = 'Erreur lors de l\'enregistrement de l\'email.';
      
      if (errorMessage.includes('Firebase') || errorMessage.includes('Firestore')) {
        userMessage = 'Erreur de connexion à la base de données. Vérifiez la configuration Firebase.';
      } else if (errorMessage.includes('FIREBASE_PROJECT_ID')) {
        userMessage = 'Configuration Firebase manquante. Veuillez contacter le support.';
      }
      
      return NextResponse.json(
        {
          success: false,
          error: userMessage,
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
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
