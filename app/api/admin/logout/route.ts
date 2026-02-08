import { NextRequest, NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/admin';

/**
 * Route de déconnexion admin
 * POST /api/admin/logout
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (token) {
      deleteAdminSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    });

    // Supprimer le cookie
    response.cookies.delete('admin_token');

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
