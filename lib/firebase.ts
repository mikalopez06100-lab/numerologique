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
    const error = new Error('FIREBASE_PROJECT_ID n\'est pas défini dans les variables d\'environnement');
    console.error('❌', error.message);
    throw error;
  }

  // Si FIREBASE_PRIVATE_KEY est défini, utiliser les credentials JSON
  if (process.env.FIREBASE_PRIVATE_KEY) {
    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      const error = new Error('FIREBASE_CLIENT_EMAIL est requis quand FIREBASE_PRIVATE_KEY est défini');
      console.error('❌', error.message);
      throw error;
    }
    
    try {
      // Nettoyer la clé privée (supprimer les guillemets si présents)
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      console.log('🔧 Initialisation Firebase avec credentials...');
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('✅ Firebase initialisé avec succès');
    } catch (initError) {
      console.error('❌ Erreur lors de l\'initialisation Firebase:', initError);
      throw new Error(`Erreur initialisation Firebase: ${initError instanceof Error ? initError.message : 'Erreur inconnue'}`);
    }
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Alternative : utiliser un fichier JSON de service account
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('✅ Firebase initialisé avec service account JSON');
    } catch (parseError) {
      console.error('❌ Erreur lors du parsing du service account:', parseError);
      throw new Error(`Erreur parsing service account: ${parseError instanceof Error ? parseError.message : 'Erreur inconnue'}`);
    }
  } else {
    // En développement local, Firebase peut utiliser les credentials par défaut
    // ou vous pouvez utiliser l'émulateur Firebase
    try {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase initialisé avec project ID uniquement');
    } catch (error) {
      console.warn('⚠️ Firebase Admin non configuré. Utilisez les variables d\'environnement ou l\'émulateur.');
      throw error;
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
  
  try {
    if (getApps().length === 0) {
      console.log('🔧 Initialisation Firebase...');
      initializeFirebase();
    }
    
    if (getApps().length === 0) {
      const error = new Error('Firebase n\'est pas initialisé. Vérifiez les variables d\'environnement.');
      console.error('❌', error.message);
      console.error('Variables présentes:', {
        FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      });
      throw error;
    }
    
    const db = getFirestore();
    console.log('✅ Firestore instance obtenue');
    return db;
  } catch (error) {
    console.error('❌ Erreur getDb:', error);
    throw error;
  }
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
