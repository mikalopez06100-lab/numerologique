import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin';

/**
 * Route pour vérifier si l'admin est connecté
 * GET /api/admin/check
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token || !verifyAdminSession(token)) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
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
