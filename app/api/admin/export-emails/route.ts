import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin';
import { getAllUsersForExport } from '@/lib/firebase-db';

/**
 * Route pour exporter les emails en CSV
 * GET /api/admin/export-emails
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
    const filter = searchParams.get('filter') as 'all' | 'with_analysis' | 'without_analysis' || 'all';

    // Récupérer tous les utilisateurs avec filtres depuis Firebase
    const users = await getAllUsersForExport(filter);

    // Générer le CSV
    const csvHeader = 'Email,Date d\'inscription,Nombre d\'analyses,Statut\n';
    const csvRows = users.map((user) => {
      const status = user.analysesCount > 0 ? 'Avec analyse' : 'Sans analyse';
      return `"${user.email}","${user.createdAt.toISOString()}",${user.analysesCount},"${status}"`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    // Retourner le CSV
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="emails-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'export:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
