# 🔍 Diagnostic : Erreur de connexion Firebase

Si vous obtenez "Erreur de connexion à la base de données" malgré la configuration des variables, suivez ce guide.

## 🧪 Étape 1 : Tester la connexion Firebase

1. **Allez sur votre site déployé** : `https://votre-projet.vercel.app`
2. **Testez la route de diagnostic** : `https://votre-projet.vercel.app/api/test-firebase`
3. **Regardez la réponse JSON** - elle vous indiquera :
   - ✅ Quelles variables sont configurées
   - ✅ Si Firebase se connecte correctement
   - ❌ L'erreur exacte si problème

## 📋 Étape 2 : Vérifier les logs Vercel

1. **Allez sur Vercel** > Votre projet > **Logs**
2. **Filtrez par** : `/api/auth/send-email` ou `/api/test-firebase`
3. **Cherchez les messages** :
   - `🔍 Vérification configuration Firebase...`
   - `✅ Firebase initialisé avec succès`
   - `❌ Erreur...`

## 🔧 Problèmes courants et solutions

### Problème 1 : FIREBASE_PRIVATE_KEY mal formatée

**Symptôme** : Erreur "Invalid credential" ou "Invalid private key"

**Solution** :
1. Dans Vercel, vérifiez `FIREBASE_PRIVATE_KEY`
2. La clé doit être sur **UNE SEULE LIGNE**
3. Format correct :
   ```
   "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   ```
4. **Vérifiez** :
   - ✅ Commence par `"-----BEGIN PRIVATE KEY-----\n`
   - ✅ Se termine par `\n-----END PRIVATE KEY-----\n"`
   - ✅ Pas de retours à la ligne réels dans Vercel
   - ✅ Tous les retours à la ligne sont `\n`

**Comment corriger** :
1. Ouvrez le fichier JSON Firebase téléchargé
2. Copiez la valeur de `private_key`
3. Remplacez tous les retours à la ligne réels par `\n`
4. Ajoutez des guillemets au début et à la fin
5. Collez dans Vercel (sur une seule ligne)

---

### Problème 2 : Permissions Firestore insuffisantes

**Symptôme** : Erreur "Missing or insufficient permissions"

**Solution** :
1. Allez dans Firebase Console > Firestore > Règles
2. Vérifiez que les règles permettent l'accès Admin SDK :
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Admin SDK peut tout faire, ces règles sont pour le client
       match /{document=**} {
         allow read, write: if false; // Bloque l'accès client direct
       }
     }
   }
   ```
3. **Important** : Les règles Firestore n'affectent PAS l'Admin SDK (celui qu'on utilise)
4. Si l'erreur persiste, vérifiez que le compte de service a les bonnes permissions dans Firebase

---

### Problème 3 : Index Firestore manquants

**Symptôme** : Erreur "Index required" ou "The query requires an index"

**Solution** :
1. Firebase vous donnera un lien direct pour créer l'index
2. Cliquez sur le lien
3. Créez l'index
4. Attendez 2-3 minutes que l'index soit créé
5. Réessayez

**Index à créer manuellement** (si nécessaire) :
- Collection `users`, champ `createdAt` (Ascendant)
- Collection `analyses`, champs `userId` (Ascendant) + `createdAt` (Descendant)

---

### Problème 4 : Variables non redéployées

**Symptôme** : Les variables sont dans Vercel mais l'erreur persiste

**Solution** :
1. Vérifiez que les variables sont définies pour **Production**
2. **Redéployez manuellement** :
   - Vercel > Deployments
   - Cliquez sur "..." sur le dernier déploiement
   - Cliquez sur "Redeploy"
3. Attendez la fin du déploiement
4. Testez à nouveau

---

### Problème 5 : Format de FIREBASE_PRIVATE_KEY avec guillemets

**Symptôme** : La clé privée contient des guillemets supplémentaires

**Solution** :
1. Dans Vercel, vérifiez `FIREBASE_PRIVATE_KEY`
2. Si elle commence par `""` (double guillemets), supprimez les guillemets externes
3. Format correct : `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
4. Pas : `""-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n""`

---

## 🔍 Vérification étape par étape

### Checklist de vérification

1. **Variables dans Vercel** :
   - [ ] `FIREBASE_PROJECT_ID` est présent
   - [ ] `FIREBASE_CLIENT_EMAIL` est présent
   - [ ] `FIREBASE_PRIVATE_KEY` est présent
   - [ ] Toutes sont définies pour **Production**

2. **Format FIREBASE_PRIVATE_KEY** :
   - [ ] Sur une seule ligne dans Vercel
   - [ ] Commence par `"-----BEGIN PRIVATE KEY-----\n`
   - [ ] Se termine par `\n-----END PRIVATE KEY-----\n"`
   - [ ] Pas de retours à la ligne réels

3. **Firebase Console** :
   - [ ] Firestore Database est activé
   - [ ] Le projet existe
   - [ ] Le compte de service existe

4. **Test** :
   - [ ] Route `/api/test-firebase` fonctionne
   - [ ] Les logs Vercel montrent "✅ Firebase initialisé"

## 🧪 Test rapide

**URL de test** : `https://votre-projet.vercel.app/api/test-firebase`

**Résultat attendu** :
```json
{
  "success": true,
  "config": {
    "FIREBASE_PROJECT_ID": "✅ Configuré",
    "FIREBASE_CLIENT_EMAIL": "✅ Configuré",
    "FIREBASE_PRIVATE_KEY": "✅ Configuré"
  },
  "tests": {
    "db": "✅ Connexion réussie",
    "user": "✅ Utilisateur test créé/récupéré: ..."
  }
}
```

**Si erreur** : La réponse vous indiquera exactement quel problème il y a.

## 📞 Après le diagnostic

Une fois que vous avez testé `/api/test-firebase`, partagez-moi :
1. Le résultat JSON de la route de test
2. Les logs Vercel (les lignes avec 🔍, ✅, ou ❌)
3. L'erreur exacte affichée

Cela m'aidera à identifier précisément le problème.

## 🔄 Redéploiement après correction

Après avoir corrigé les variables :
1. **Redéployez** sur Vercel
2. **Testez** `/api/test-firebase`
3. **Testez** l'enregistrement d'email
4. **Vérifiez les logs** si problème persiste
