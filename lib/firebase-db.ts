// Service de base de données Firebase pour remplacer Prisma
import { db } from './firebase';
import { 
  CollectionReference, 
  DocumentData, 
  Query, 
  Timestamp 
} from 'firebase-admin/firestore';

// Types pour correspondre au schéma Prisma
export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analyse {
  id: string;
  userId: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  cheminDeVie: number;
  nombreExpression: number;
  nombreIntime: number;
  analyseData: string; // JSON stringifié
  pdfGenerated: boolean;
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Fonction pour obtenir les collections (lazy)
function getUsersCollection() {
  return db.collection('users');
}

function getAnalysesCollection() {
  return db.collection('analyses');
}

/**
 * Convertit un Timestamp Firestore en Date
 */
function timestampToDate(timestamp: Timestamp | Date | null | undefined): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
}

/**
 * Convertit une Date en Timestamp Firestore
 */
function dateToTimestamp(date: Date | string): Timestamp {
  if (typeof date === 'string') {
    return Timestamp.fromDate(new Date(date));
  }
  return Timestamp.fromDate(date);
}

// ========== USER OPERATIONS ==========

/**
 * Crée ou récupère un utilisateur par email
 */
export async function getOrCreateUser(email: string): Promise<User> {
  // Chercher l'utilisateur par email
  const userQuery = await getUsersCollection().where('email', '==', email).limit(1).get();
  
  if (!userQuery.empty) {
    const doc = userQuery.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    };
  }

  // Créer un nouvel utilisateur
  const now = new Date();
  const userRef = await getUsersCollection().add({
    email,
    createdAt: dateToTimestamp(now),
    updatedAt: dateToTimestamp(now),
  });

  return {
    id: userRef.id,
    email,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Récupère un utilisateur par email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const userQuery = await getUsersCollection().where('email', '==', email).limit(1).get();
  
  if (userQuery.empty) {
    return null;
  }

  const doc = userQuery.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    email: data.email,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
}

/**
 * Vérifie si un utilisateur a déjà fait une analyse
 */
export async function hasUserAlreadyAnalyzed(email: string): Promise<boolean> {
  const user = await getUserByEmail(email);
  if (!user) return false;

  const analysesQuery = await getAnalysesCollection()
    .where('userId', '==', user.id)
    .limit(1)
    .get();

  return !analysesQuery.empty;
}

/**
 * Récupère le nombre total d'utilisateurs
 */
export async function getUsersCount(): Promise<number> {
  const totalSnapshot = await getUsersCollection().count().get();
  return totalSnapshot.data().count;
}

/**
 * Récupère tous les utilisateurs avec pagination
 * Note: Firestore ne supporte pas offset, donc on récupère tous les documents et on pagine en mémoire
 * Pour de grandes collections, utilisez startAfter avec des cursors
 */
export async function getUsers(options: {
  page?: number;
  limit?: number;
}): Promise<{ users: User[]; total: number }> {
  const page = options.page || 1;
  const limit = options.limit || 50;

  // Récupérer le total
  const total = await getUsersCount();

  // Récupérer tous les utilisateurs (Firestore ne supporte pas offset nativement)
  // Pour de grandes collections, il faudrait implémenter une pagination avec startAfter
  const allUsersSnapshot = await getUsersCollection()
    .orderBy('createdAt', 'desc')
    .get();

  const allUsers: User[] = allUsersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      email: data.email,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    };
  });

  // Paginer en mémoire
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const users = allUsers.slice(startIndex, endIndex);

  return { users, total };
}

// ========== ANALYSE OPERATIONS ==========

/**
 * Crée une nouvelle analyse
 */
export async function createAnalyse(data: {
  userId: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  cheminDeVie: number;
  nombreExpression: number;
  nombreIntime: number;
  analyseData: string;
}): Promise<Analyse> {
  const now = new Date();
  const analyseRef = await getAnalysesCollection().add({
    ...data,
    pdfGenerated: false,
    emailSent: false,
    createdAt: dateToTimestamp(now),
    updatedAt: dateToTimestamp(now),
  });

  return {
    id: analyseRef.id,
    ...data,
    pdfGenerated: false,
    emailSent: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Met à jour une analyse
 */
export async function updateAnalyse(
  id: string,
  data: Partial<Pick<Analyse, 'pdfGenerated' | 'emailSent' | 'analyseData'>>
): Promise<void> {
  await getAnalysesCollection().doc(id).update({
    ...data,
    updatedAt: dateToTimestamp(new Date()),
  });
}

/**
 * Récupère une analyse par ID
 */
export async function getAnalyseById(id: string): Promise<Analyse | null> {
  const doc = await getAnalysesCollection().doc(id).get();
  
  if (!doc.exists) {
    return null;
  }

  const data = doc.data()!;
  return {
    id: doc.id,
    userId: data.userId,
    prenom: data.prenom,
    nom: data.nom,
    dateNaissance: data.dateNaissance,
    cheminDeVie: data.cheminDeVie,
    nombreExpression: data.nombreExpression,
    nombreIntime: data.nombreIntime,
    analyseData: data.analyseData,
    pdfGenerated: data.pdfGenerated,
    emailSent: data.emailSent,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
}

/**
 * Récupère toutes les analyses d'un utilisateur
 */
export async function getAnalysesByUserId(userId: string): Promise<Analyse[]> {
  const snapshot = await getAnalysesCollection()
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      prenom: data.prenom,
      nom: data.nom,
      dateNaissance: data.dateNaissance,
      cheminDeVie: data.cheminDeVie,
      nombreExpression: data.nombreExpression,
      nombreIntime: data.nombreIntime,
      analyseData: data.analyseData,
      pdfGenerated: data.pdfGenerated,
      emailSent: data.emailSent,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    };
  });
}

/**
 * Récupère les statistiques
 */
export async function getStats(): Promise<{
  totalUsers: number;
  totalAnalyses: number;
  analysesWithPDF: number;
  analysesWithEmail: number;
  conversionRate: string;
  topUsers: Array<{
    email: string;
    analysesCount: number;
    createdAt: Date;
  }>;
}> {
  const [usersCount, analysesCount, pdfCount, emailCount] = await Promise.all([
    getUsersCollection().count().get(),
    getAnalysesCollection().count().get(),
    getAnalysesCollection().where('pdfGenerated', '==', true).count().get(),
    getAnalysesCollection().where('emailSent', '==', true).count().get(),
  ]);

  const totalUsers = usersCount.data().count;
  const totalAnalyses = analysesCount.data().count;
  const analysesWithPDF = pdfCount.data().count;
  const analysesWithEmail = emailCount.data().count;

  // Récupérer les top utilisateurs
  const topUsersSnapshot = await getUsersCollection()
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();

  const topUsers = await Promise.all(
    topUsersSnapshot.docs.map(async (doc) => {
      const userData = doc.data();
      const analyses = await getAnalysesByUserId(doc.id);
      return {
        email: userData.email,
        analysesCount: analyses.length,
        createdAt: timestampToDate(userData.createdAt),
      };
    })
  );

  return {
    totalUsers,
    totalAnalyses,
    analysesWithPDF,
    analysesWithEmail,
    conversionRate: totalUsers > 0 ? ((totalAnalyses / totalUsers) * 100).toFixed(2) : '0',
    topUsers,
  };
}

/**
 * Récupère tous les utilisateurs avec filtres (pour export)
 */
export async function getAllUsersForExport(filter?: 'all' | 'with_analysis' | 'without_analysis'): Promise<Array<{
  email: string;
  createdAt: Date;
  analysesCount: number;
}>> {
  const usersSnapshot = await getUsersCollection()
    .orderBy('createdAt', 'desc')
    .get();

  const usersWithCounts = await Promise.all(
    usersSnapshot.docs.map(async (doc) => {
      const userData = doc.data();
      const analyses = await getAnalysesByUserId(doc.id);
      return {
        email: userData.email,
        createdAt: timestampToDate(userData.createdAt),
        analysesCount: analyses.length,
      };
    })
  );

  // Appliquer le filtre
  if (filter === 'with_analysis') {
    return usersWithCounts.filter((u) => u.analysesCount > 0);
  } else if (filter === 'without_analysis') {
    return usersWithCounts.filter((u) => u.analysesCount === 0);
  }

  return usersWithCounts;
}

/**
 * Récupère tous les utilisateurs avec leurs analyses (pour l'admin)
 */
export async function getUsersWithAnalyses(options: {
  page?: number;
  limit?: number;
}): Promise<Array<{
  id: string;
  email: string;
  createdAt: Date;
  analysesCount: number;
  hasAnalysis: boolean;
  lastAnalysis: Analyse | null;
  pdfGenerated: boolean;
  emailSent: boolean;
}>> {
  const { users } = await getUsers(options);

  // Pour chaque utilisateur, récupérer ses analyses
  const usersWithAnalyses = await Promise.all(
    users.map(async (user) => {
      const analyses = await getAnalysesByUserId(user.id);
      const lastAnalysis = analyses[0] || null;

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        analysesCount: analyses.length,
        hasAnalysis: analyses.length > 0,
        lastAnalysis,
        pdfGenerated: lastAnalysis?.pdfGenerated || false,
        emailSent: lastAnalysis?.emailSent || false,
      };
    })
  );

  return usersWithAnalyses;
}
