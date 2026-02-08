import { NextRequest, NextResponse } from 'next/server';
import { deleteAuthToken } from '@/lib/auth';

/**
 * Route pour déconnecter l'utilisateur
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies pour le supprimer de la mémoire
    const token = request.cookies.get('auth_token')?.value;
    
    if (token) {
      // Supprimer le token de la mémoire
      deleteAuthToken(token);
    }

    // Créer la réponse
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    });

    // Supprimer les cookies d'authentification
    response.cookies.delete('auth_token');
    response.cookies.delete('auth_email');

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
