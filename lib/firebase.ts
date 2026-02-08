// Configuration Firebase Admin SDK
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialiser Firebase Admin si ce n'est pas déjà fait
if (getApps().length === 0) {
  // Vérifier si les variables d'environnement sont définies
  if (!process.env.FIREBASE_PROJECT_ID) {
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

// Obtenir l'instance Firestore
export const db = getFirestore();
