// Configuration Firebase Admin SDK
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Fonction pour initialiser Firebase (lazy initialization)
function initializeFirebase() {
  if (getApps().length > 0) {
    return; // Déjà initialisé
  }

  // Vérifier si les variables d'environnement sont définies
  if (!process.env.FIREBASE_PROJECT_ID) {
    // En mode build, on ne lance pas d'erreur
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('⚠️ FIREBASE_PROJECT_ID n\'est pas défini. Firebase ne sera pas initialisé pendant le build.');
      return;
    }
    throw new Error('FIREBASE_PROJECT_ID n\'est pas défini dans les variables d\'environnement');
  }

  // Si FIREBASE_PRIVATE_KEY est défini, utiliser les credentials JSON
  if (process.env.FIREBASE_PRIVATE_KEY) {
    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('FIREBASE_CLIENT_EMAIL est requis quand FIREBASE_PRIVATE_KEY est défini');
    }
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Alternative : utiliser un fichier JSON de service account
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // En développement local, Firebase peut utiliser les credentials par défaut
    // ou vous pouvez utiliser l'émulateur Firebase
    try {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } catch (error) {
      console.warn('⚠️ Firebase Admin non configuré. Utilisez les variables d\'environnement ou l\'émulateur.');
    }
  }
}

// Initialiser Firebase si les variables sont définies
if (process.env.FIREBASE_PROJECT_ID) {
  initializeFirebase();
}

// Obtenir l'instance Firestore
export function getDb() {
  // Pendant le build, retourner null (les routes API ne seront pas exécutées)
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }
  
  if (getApps().length === 0) {
    initializeFirebase();
  }
  
  if (getApps().length === 0) {
    throw new Error('Firebase n\'est pas initialisé. Vérifiez les variables d\'environnement.');
  }
  
  return getFirestore();
}

// Export pour compatibilité (lazy)
let _db: ReturnType<typeof getFirestore> | null = null;

export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(target, prop) {
    if (!_db) {
      const dbInstance = getDb();
      if (!dbInstance) {
        // Pendant le build, retourner des fonctions no-op
        if (prop === 'collection') {
          return () => ({
            add: () => Promise.resolve({ id: 'build-id' }),
            doc: () => ({
              get: () => Promise.resolve({ exists: false }),
              update: () => Promise.resolve(),
            }),
            where: () => ({
              limit: () => ({
                get: () => Promise.resolve({ empty: true, docs: [] }),
              }),
              orderBy: () => ({
                get: () => Promise.resolve({ empty: true, docs: [] }),
              }),
            }),
            orderBy: () => ({
              offset: () => ({
                limit: () => ({
                  get: () => Promise.resolve({ empty: true, docs: [] }),
                }),
              }),
              limit: () => ({
                get: () => Promise.resolve({ empty: true, docs: [] }),
              }),
            }),
            count: () => ({
              get: () => Promise.resolve({ data: () => ({ count: 0 }) }),
            }),
            get: () => Promise.resolve({ empty: true, docs: [] }),
          });
        }
        return () => {};
      }
      _db = dbInstance;
    }
    const value = _db[prop as keyof ReturnType<typeof getFirestore>];
    if (typeof value === 'function') {
      return value.bind(_db);
    }
    return value;
  }
});
