import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin';
import { getUsersWithAnalyses, getUsersCount } from '@/lib/firebase-db';

/**
 * Route pour obtenir la liste des utilisateurs
 * GET /api/admin/users
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

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Récupérer les utilisateurs avec leurs analyses depuis Firebase
    const users = await getUsersWithAnalyses({ page, limit });
    const total = await getUsersCount();

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        analysesCount: user.analysesCount,
        hasAnalysis: user.hasAnalysis,
        lastAnalysis: user.lastAnalysis,
        pdfGenerated: user.pdfGenerated,
        emailSent: user.emailSent,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
