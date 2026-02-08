# 🔥 Activer l'API Cloud Firestore

## ❌ Problème Identifié

L'erreur indique que l'API Cloud Firestore n'est pas activée dans votre projet Firebase :
```
7 PERMISSION_DENIED : L'API Cloud Firestore n'a pas été utilisée dans le projet numérologique-ed43e ou elle est désactivée.
```

## ✅ Solution : Activer Firestore

### Méthode 1 : Via le Lien Direct (Recommandé)

1. **Cliquez sur ce lien** (remplacez `numerologique-ed43e` par votre Project ID si différent) :
   ```
   https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=numerologique-ed43e
   ```

2. **Cliquez sur "ACTIVER"** (ou "ENABLE" en anglais)

3. **Attendez 1-2 minutes** que l'activation se propage

4. **Testez à nouveau** : `https://votre-projet.vercel.app/api/test-firebase`

### Méthode 2 : Via Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)

2. Sélectionnez votre projet : **numérologique-ed43e**

3. Dans le menu de gauche, cliquez sur **"Firestore Database"**

4. Si vous voyez un bouton **"Créer une base de données"** ou **"Create database"**, cliquez dessus

5. Choisissez le mode :
   - **Mode Production** (recommandé pour la production)
   - **Mode Test** (pour le développement)

6. Sélectionnez une région (ex: `europe-west1`)

7. Cliquez sur **"Créer"** ou **"Create"**

8. **Attendez 1-2 minutes** que la base de données soit créée

### Méthode 3 : Via Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)

2. Sélectionnez votre projet : **numérologique-ed43e**

3. Dans le menu, allez dans **"APIs & Services"** > **"Library"**

4. Recherchez **"Cloud Firestore API"**

5. Cliquez dessus et cliquez sur **"ENABLE"** ou **"ACTIVER"**

6. **Attendez 1-2 minutes**

## ⏱️ Après Activation

1. **Attendez 1-2 minutes** que l'activation se propage dans tous les systèmes Google

2. **Testez à nouveau** :
   - Allez sur : `https://votre-projet.vercel.app/api/test-firebase`
   - Vous devriez voir : `"user": "✅ Utilisateur test créé/récupéré: ..."`

3. **Testez l'application** :
   - Essayez d'entrer un email
   - Ça devrait fonctionner maintenant !

## 🔍 Vérification

Si après activation vous avez toujours une erreur :

1. Vérifiez que vous avez bien sélectionné le **bon projet** (numérologique-ed43e)
2. Vérifiez que l'API est bien **activée** dans Google Cloud Console
3. Attendez **2-3 minutes supplémentaires** (parfois ça prend un peu plus de temps)
4. Vérifiez les **règles de sécurité Firestore** (elles doivent permettre les opérations)

## 📝 Note Importante

Si vous créez une nouvelle base de données Firestore, vous devrez peut-être configurer les **règles de sécurité** pour permettre les opérations. Par défaut, Firestore en mode Production nécessite une authentification.

Pour le développement, vous pouvez temporairement utiliser des règles permissives :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Mais comme vous utilisez Firebase Admin SDK (côté serveur), les règles ne s'appliquent pas - l'Admin SDK a des privilèges complets.

## ✅ Une Fois Activé

Une fois Firestore activé, votre application devrait fonctionner parfaitement ! 🎉
