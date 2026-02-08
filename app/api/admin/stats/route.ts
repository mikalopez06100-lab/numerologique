import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin';
import { getStats } from '@/lib/firebase-db';

/**
 * Route pour obtenir les statistiques du back office
 * GET /api/admin/stats
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyAdminSession(token)) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les statistiques depuis Firebase
    const stats = await getStats();

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        analysesByDate: [], // TODO: Implémenter si nécessaire
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
