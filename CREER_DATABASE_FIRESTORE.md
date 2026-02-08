# 🗄️ Créer la Base de Données Firestore

## ❌ Problème Identifié

L'erreur `5 NOT_FOUND` indique que l'API Firestore est activée, mais la **base de données Firestore elle-même n'existe pas encore** dans votre projet.

## ✅ Solution : Créer la Base de Données

### Méthode 1 : Via Firebase Console (Recommandé)

1. **Allez sur [Firebase Console](https://console.firebase.google.com/)**

2. **Sélectionnez votre projet** : `numérologique-ed43e`

3. **Dans le menu de gauche**, cliquez sur **"Firestore Database"** (ou "Firestore" dans certaines versions)

4. **Si vous voyez un écran d'accueil** avec un bouton :
   - **"Créer une base de données"** (en français)
   - **"Create database"** (en anglais)
   
   **Cliquez dessus**

5. **Choisissez le mode de sécurité** :
   - **Mode Production** (recommandé) : Nécessite des règles de sécurité strictes
   - **Mode Test** : Règles permissives pour 30 jours (pour le développement)
   
   ⚠️ **Note** : Comme vous utilisez Firebase Admin SDK (côté serveur), les règles de sécurité ne s'appliquent pas. Vous pouvez choisir n'importe quel mode.

6. **Sélectionnez une région** :
   - **`europe-west1`** (Belgium) - Recommandé pour l'Europe
   - **`us-central1`** (Iowa) - Pour les États-Unis
   - **`asia-southeast1`** (Singapore) - Pour l'Asie
   
   💡 **Conseil** : Choisissez la région la plus proche de vos utilisateurs

7. **Cliquez sur "Créer"** ou **"Create"**

8. **Attendez 1-2 minutes** que la base de données soit créée

9. **Testez à nouveau** : `https://votre-projet.vercel.app/api/test-firebase`

### Méthode 2 : Via Google Cloud Console

1. **Allez sur [Google Cloud Console](https://console.cloud.google.com/)**

2. **Sélectionnez votre projet** : `numérologique-ed43e`

3. **Dans le menu**, allez dans **"Firestore"** > **"Data"**

4. **Si vous voyez "Create database"**, cliquez dessus

5. **Suivez les mêmes étapes** que la Méthode 1 (choix du mode et de la région)

## ⏱️ Après Création

1. **Attendez 1-2 minutes** que la base de données soit complètement initialisée

2. **Testez à nouveau** :
   - Allez sur : `https://votre-projet.vercel.app/api/test-firebase`
   - Vous devriez voir : `"user": "✅ Utilisateur test créé/récupéré: ..."`

3. **Testez l'application** :
   - Essayez d'entrer un email
   - Ça devrait fonctionner maintenant ! 🎉

## 🔍 Vérification

Pour vérifier que la base de données est créée :

1. **Firebase Console** > Votre projet > **Firestore Database**
2. Vous devriez voir un écran avec :
   - Un bouton **"Démarrer la collection"** ou **"Start collection"**
   - Ou une interface vide avec des options pour créer des collections

## 📝 Note sur les Règles de Sécurité

Même si vous créez la base de données en mode Production, **les règles de sécurité ne s'appliquent pas** à Firebase Admin SDK (côté serveur). L'Admin SDK a des privilèges complets.

Les règles de sécurité s'appliquent uniquement aux clients (web, mobile) qui utilisent les SDK clients Firebase.

## ✅ Une Fois Créée

Une fois la base de données Firestore créée, votre application devrait fonctionner parfaitement ! 

Les collections `users` et `analyses` seront créées automatiquement lors de la première utilisation.
