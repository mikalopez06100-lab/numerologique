import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getAnalysesByUserId } from '@/lib/firebase-db';

/**
 * Route pour récupérer l'analyse de l'utilisateur connecté
 * GET /api/analyse/mon-analyse
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer l'email depuis les cookies
    const email = request.cookies.get('auth_email')?.value;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les analyses de l'utilisateur (la plus récente en premier)
    const analyses = await getAnalysesByUserId(user.id);

    if (analyses.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucune analyse trouvée' },
        { status: 404 }
      );
    }

    // Prendre la plus récente
    const derniereAnalyse = analyses[0];

    // Parser l'analyseData JSON
    let analyseData;
    try {
      analyseData = JSON.parse(derniereAnalyse.analyseData);
    } catch (error) {
      console.error('Erreur lors du parsing de analyseData:', error);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la récupération de l\'analyse' },
        { status: 500 }
      );
    }

    // Reconstruire l'objet AnalyseNumerologique
    const analyseComplete = {
      id: derniereAnalyse.id,
      dateCreation: derniereAnalyse.createdAt.toISOString(),
      donnees: {
        prenom: derniereAnalyse.prenom,
        nom: derniereAnalyse.nom,
        dateNaissance: derniereAnalyse.dateNaissance,
      },
      analyse: {
        cheminDeVie: derniereAnalyse.cheminDeVie,
        nombreExpression: derniereAnalyse.nombreExpression,
        nombreIntime: derniereAnalyse.nombreIntime,
        ...analyseData,
      },
    };

    return NextResponse.json({
      success: true,
      data: analyseComplete,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'analyse:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
