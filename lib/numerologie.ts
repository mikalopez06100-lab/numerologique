// Utilitaires pour les calculs numérologiques de base

/**
 * Réduit un nombre à un chiffre unique (1-9) ou un maître nombre (11, 22, 33)
 * Utilisé pour les calculs intermédiaires où les nombres maîtres peuvent être conservés
 */
export function reduireNombre(nombre: number): number {
  if (nombre === 11 || nombre === 22 || nombre === 33) {
    return nombre; // Maître nombre
  }
  
  while (nombre > 9) {
    nombre = nombre
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    
    if (nombre === 11 || nombre === 22 || nombre === 33) {
      return nombre;
    }
  }
  
  return nombre;
}

/**
 * Réduit un nombre à un chiffre unique (1-9) en réduisant aussi les nombres maîtres
 * Utilisé pour l'affichage final des résultats
 */
export function reduireNombreFinal(nombre: number): number {
  while (nombre > 9) {
    nombre = nombre
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return nombre;
}

/**
 * Convertit une lettre en valeur numérologique (A=1, B=2, etc.)
 */
export function lettreVersNombre(lettre: string): number {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const index = alphabet.indexOf(lettre.toUpperCase());
  return index >= 0 ? index + 1 : 0;
}

/**
 * Calcule la valeur numérologique d'un nom complet
 * Réduit toujours à un chiffre unique (1-9)
 */
export function calculerValeurNom(nomComplet: string): number {
  const lettres = nomComplet.replace(/[^A-Za-z]/g, '').split('');
  const somme = lettres.reduce((sum, lettre) => {
    return sum + lettreVersNombre(lettre);
  }, 0);
  
  return reduireNombreFinal(somme);
}

/**
 * Calcule les détails intermédiaires pour un nom (pour explication)
 */
export function calculerDetailsNom(nomComplet: string): {
  lettres: Array<{ lettre: string; valeur: number }>;
  somme: number;
  nombreFinal: number;
} {
  const lettres = nomComplet.replace(/[^A-Za-z]/g, '').split('');
  const detailsLettres = lettres.map((lettre) => ({
    lettre: lettre.toUpperCase(),
    valeur: lettreVersNombre(lettre),
  }));
  const somme = detailsLettres.reduce((sum, item) => sum + item.valeur, 0);
  const nombreFinal = reduireNombreFinal(somme);
  
  return {
    lettres: detailsLettres,
    somme,
    nombreFinal,
  };
}

/**
 * Valide le format de date (DD/MM/YYYY)
 */
export function validerDate(date: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(date)) {
    return false;
  }
  
  const [, jour, mois, annee] = date.match(regex)!;
  const dateObj = new Date(parseInt(annee), parseInt(mois) - 1, parseInt(jour));
  
  return (
    dateObj.getDate() === parseInt(jour) &&
    dateObj.getMonth() === parseInt(mois) - 1 &&
    dateObj.getFullYear() === parseInt(annee)
  );
}

/**
 * Convertit une date du format HTML (YYYY-MM-DD) vers le format DD/MM/YYYY
 */
export function convertirDateHTMLVersFormat(dateHTML: string): string {
  if (!dateHTML) return '';
  
  const [annee, mois, jour] = dateHTML.split('-');
  if (!annee || !mois || !jour) return '';
  
  return `${jour}/${mois}/${annee}`;
}

/**
 * Convertit une date du format DD/MM/YYYY vers le format HTML (YYYY-MM-DD)
 */
export function convertirFormatVersDateHTML(dateFormat: string): string {
  if (!dateFormat) return '';
  
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateFormat)) return '';
  
  const [, jour, mois, annee] = dateFormat.match(regex)!;
  return `${annee}-${mois}-${jour}`;
}

/**
 * Calcule le chemin de vie à partir d'une date de naissance
 * Le chemin de vie est toujours réduit à un chiffre unique (1-9)
 * Même si un nombre maître (11, 22, 33) apparaît, il est réduit
 */
export function calculerCheminDeVie(dateNaissance: string): number {
  const [, jour, mois, annee] = dateNaissance.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)!;
  
  // Réduire le jour (ex: 10 → 1+0 = 1)
  const sommeJour = reduireNombreFinal(parseInt(jour));
  
  // Réduire le mois (ex: 10 → 1+0 = 1)
  const sommeMois = reduireNombreFinal(parseInt(mois));
  
  // Réduire l'année (ex: 1980 → 1+9+8+0 = 18 → 1+8 = 9)
  const sommeAnnee = reduireNombreFinal(
    annee.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0)
  );
  
  // Additionner et réduire à un chiffre unique
  // Ex: 1 + 1 + 9 = 11 → 1+1 = 2
  const cheminDeVie = reduireNombreFinal(sommeJour + sommeMois + sommeAnnee);
  return cheminDeVie;
}

/**
 * Calcule les détails du chemin de vie (pour explication)
 */
export function calculerDetailsCheminDeVie(dateNaissance: string): {
  jour: number;
  mois: number;
  annee: number;
  sommeAnnee: number;
  sommeJour: number;
  sommeMois: number;
  cheminDeVie: number;
} {
  const [, jour, mois, annee] = dateNaissance.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)!;
  const jourNum = parseInt(jour);
  const moisNum = parseInt(mois);
  const anneeNum = parseInt(annee);
  
  const sommeAnnee = annee.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const sommeJour = reduireNombreFinal(jourNum);
  const sommeMois = reduireNombreFinal(moisNum);
  const sommeAnneeReduite = reduireNombreFinal(sommeAnnee);
  const cheminDeVie = reduireNombreFinal(sommeJour + sommeMois + sommeAnneeReduite);
  
  return {
    jour: jourNum,
    mois: moisNum,
    annee: anneeNum,
    sommeAnnee,
    sommeJour,
    sommeMois,
    cheminDeVie,
  };
}

/**
 * Calcule l'année personnelle pour une année donnée
 * Formule : Chemin de vie + Année universelle
 */
export function calculerAnneePersonnelle(
  dateNaissance: string,
  annee: number
): {
  cheminDeVie: number;
  anneeUniverselle: number;
  anneePersonnelle: number;
  details: {
    sommeAnnee: number;
    anneeUniverselleReduite: number;
  };
} {
  const cheminDeVie = calculerCheminDeVie(dateNaissance);
  
  // Calcul de l'année universelle (somme des chiffres de l'année)
  const sommeAnnee = annee
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const anneeUniverselle = reduireNombreFinal(sommeAnnee);
  
  // Année personnelle = Chemin de vie + Année universelle
  const anneePersonnelle = reduireNombreFinal(cheminDeVie + anneeUniverselle);
  
  return {
    cheminDeVie,
    anneeUniverselle,
    anneePersonnelle,
    details: {
      sommeAnnee,
      anneeUniverselleReduite: anneeUniverselle,
    },
  };
}

/**
 * Calcule la compatibilité entre deux personnes
 * Basé sur la comparaison des chemins de vie, expressions et intimes
 * Gère les données optionnelles (nom et date de naissance)
 */
export function calculerCompatibilite(
  personne1: { prenom: string; nom?: string; dateNaissance?: string },
  personne2: { prenom: string; nom?: string; dateNaissance?: string }
): {
  personne1: {
    cheminDeVie: number | null;
    nombreExpression: number;
    nombreIntime: number;
  };
  personne2: {
    cheminDeVie: number | null;
    nombreExpression: number;
    nombreIntime: number;
  };
  compatibilite: {
    cheminDeVie: number | null; // Différence entre les deux (null si une date manque)
    expression: number;
    intime: number;
    scoreGlobal: number; // Moyenne des différences disponibles
  };
} {
  // Calcul du chemin de vie (si date disponible)
  const cheminDeVie1 = personne1.dateNaissance ? calculerCheminDeVie(personne1.dateNaissance) : null;
  const cheminDeVie2 = personne2.dateNaissance ? calculerCheminDeVie(personne2.dateNaissance) : null;
  
  // Calcul de l'expression (prénom + nom si disponible, sinon seulement prénom)
  const nomComplet1 = personne1.nom ? `${personne1.prenom} ${personne1.nom}` : personne1.prenom;
  const nomComplet2 = personne2.nom ? `${personne2.prenom} ${personne2.nom}` : personne2.prenom;
  const expression1 = calculerValeurNom(nomComplet1);
  const expression2 = calculerValeurNom(nomComplet2);
  
  // Calcul de l'intime (basé sur le prénom uniquement)
  const intime1 = calculerValeurNom(personne1.prenom);
  const intime2 = calculerValeurNom(personne2.prenom);
  
  // Calcul des différences
  const diffCheminDeVie = (cheminDeVie1 !== null && cheminDeVie2 !== null) 
    ? Math.abs(cheminDeVie1 - cheminDeVie2) 
    : null;
  const diffExpression = Math.abs(expression1 - expression2);
  const diffIntime = Math.abs(intime1 - intime2);
  
  // Score global (moyenne des différences disponibles)
  const differencesDisponibles = [diffExpression, diffIntime];
  if (diffCheminDeVie !== null) {
    differencesDisponibles.push(diffCheminDeVie);
  }
  const scoreGlobal = Math.round(
    differencesDisponibles.reduce((sum, diff) => sum + diff, 0) / differencesDisponibles.length
  );
  
  return {
    personne1: {
      cheminDeVie: cheminDeVie1,
      nombreExpression: expression1,
      nombreIntime: intime1,
    },
    personne2: {
      cheminDeVie: cheminDeVie2,
      nombreExpression: expression2,
      nombreIntime: intime2,
    },
    compatibilite: {
      cheminDeVie: diffCheminDeVie,
      expression: diffExpression,
      intime: diffIntime,
      scoreGlobal,
    },
  };
}

/**
 * Calcule les prévisions pour 3, 6 et 9 ans à partir d'une année de référence
 */
export function calculerPrevisions(
  dateNaissance: string,
  anneeReference: number
): {
  anneeReference: number;
  annee3: {
    annee: number;
    anneePersonnelle: number;
  };
  annee6: {
    annee: number;
    anneePersonnelle: number;
  };
  annee9: {
    annee: number;
    anneePersonnelle: number;
  };
} {
  const annee3 = anneeReference + 3;
  const annee6 = anneeReference + 6;
  const annee9 = anneeReference + 9;
  
  return {
    anneeReference,
    annee3: {
      annee: annee3,
      anneePersonnelle: calculerAnneePersonnelle(dateNaissance, annee3).anneePersonnelle,
    },
    annee6: {
      annee: annee6,
      anneePersonnelle: calculerAnneePersonnelle(dateNaissance, annee6).anneePersonnelle,
    },
    annee9: {
      annee: annee9,
      anneePersonnelle: calculerAnneePersonnelle(dateNaissance, annee9).anneePersonnelle,
    },
  };
}

/**
 * Calcule les dates optimales pour un événement
 * Basé sur la compatibilité entre la date et le profil numérologique
 */
export function calculerDateOptimale(
  dateNaissance: string,
  cheminDeVie: number,
  periode: { debut: string; fin: string } // Format DD/MM/YYYY
): {
  cheminDeVie: number;
  periode: { debut: string; fin: string };
  // Cette fonction retournera les dates optimales calculées par l'API
  // Le calcul réel sera fait côté serveur avec OpenAI
} {
  return {
    cheminDeVie,
    periode,
  };
}
