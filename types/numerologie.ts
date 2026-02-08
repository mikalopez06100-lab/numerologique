// Types pour les données numérologiques

export interface FormulaireNumerologie {
  prenom: string;
  nom: string;
  dateNaissance: string; // Format: DD/MM/YYYY
}

export interface AnalyseNumerologique {
  id: string;
  dateCreation: string;
  donnees: FormulaireNumerologie;
  analyse: {
    // Nombres calculés (toujours présents)
    cheminDeVie?: number;
    nombreExpression?: number;
    nombrePersonnalite?: number;
    nombreIntime?: number;
    // Ancienne structure (fallback)
    description?: string;
    pointsForts?: string[];
    defis?: string[];
    conseils?: string[];
    // Nouvelle structure OpenAI (objets détaillés)
    introduction?: string;
    cheminDeVieDetail?: {
      explicationCalcul?: string;
      signification?: {
        tendancesPersonnalite?: string;
        forcesNaturelles?: string;
        defisRecurrents?: string;
        environnementFavorable?: string;
      };
    };
    nombreExpressionDetail?: {
      explicationCalcul?: string;
      interpretation?: {
        maniereAgir?: string;
        talentsDominants?: string;
        postureRelationnelle?: string;
      };
    };
    nombreIntimeDetail?: {
      explicationCalcul?: string;
      interpretation?: {
        motivationsProfondes?: string;
      };
    };
    coherenceGlobale?: {
      analyse?: string;
      axesDeveloppement?: string;
      leviersEvolution?: string;
    };
    conclusion?: {
      synthese?: string;
      conseilsOrientations?: string;
      perspectiveAvenir?: string;
    };
  };
}

export interface ApiResponse {
  success: boolean;
  data?: AnalyseNumerologique;
  error?: string;
}
