# 🔍 Dépannage : Erreur lors de l'enregistrement d'email

Si vous voyez le message "Une erreur est survenue" lors de l'enregistrement d'un email, voici comment diagnostiquer et résoudre le problème.

## 🔴 Problème le plus probable : Configuration Firebase manquante

### Vérification rapide

1. **Allez sur votre projet Vercel**
2. **Settings > Environment Variables**
3. **Vérifiez que ces variables sont définies** :
   - ✅ `FIREBASE_PROJECT_ID`
   - ✅ `FIREBASE_CLIENT_EMAIL`
   - ✅ `FIREBASE_PRIVATE_KEY`

### Si les variables manquent

1. **Récupérez vos credentials Firebase** :
   - Allez sur [Firebase Console](https://console.firebase.google.com/)
   - Sélectionnez votre projet
   - Paramètres du projet > Comptes de service
   - Cliquez sur "Générer une nouvelle clé privée"
   - Téléchargez le fichier JSON

2. **Ajoutez les variables dans Vercel** :
   - `FIREBASE_PROJECT_ID` : L'ID de votre projet (visible dans Firebase Console)
   - `FIREBASE_CLIENT_EMAIL` : La valeur de `client_email` dans le JSON
   - `FIREBASE_PRIVATE_KEY` : La valeur de `private_key` dans le JSON (sur une seule ligne avec `\n`)

3. **Redéployez** :
   - Vercel redéploiera automatiquement après l'ajout des variables
   - OU cliquez sur "Redeploy" dans Vercel

## 🔍 Vérification des logs Vercel

1. **Allez sur Vercel > Votre projet > Logs**
2. **Cherchez les erreurs** contenant :
   - `Firebase`
   - `FIREBASE_PROJECT_ID`
   - `Firestore`
   - `Erreur base de données`

3. **Les messages d'erreur vous indiqueront** :
   - Si Firebase n'est pas initialisé
   - Si les credentials sont incorrects
   - Si les permissions Firestore sont insuffisantes

## 🔧 Solutions selon l'erreur

### Erreur : "FIREBASE_PROJECT_ID n'est pas défini"
**Solution** : Ajoutez la variable `FIREBASE_PROJECT_ID` dans Vercel

### Erreur : "Firebase n'est pas initialisé"
**Solution** : 
1. Vérifiez que toutes les variables Firebase sont définies
2. Vérifiez le format de `FIREBASE_PRIVATE_KEY` (doit être sur une ligne avec `\n`)
3. Redéployez

### Erreur : "Missing or insufficient permissions"
**Solution** :
1. Allez dans Firebase Console > Firestore > Règles
2. Vérifiez que votre compte de service a les permissions nécessaires
3. Les règles Firestore doivent permettre l'accès (ou être gérées côté serveur via Admin SDK)

### Erreur : "Index required"
**Solution** :
1. Firebase vous donnera un lien pour créer l'index
2. Cliquez sur le lien et créez l'index
3. Attendez quelques minutes que l'index soit créé
4. Réessayez

## 📋 Checklist de vérification

- [ ] `FIREBASE_PROJECT_ID` est défini dans Vercel
- [ ] `FIREBASE_CLIENT_EMAIL` est défini dans Vercel
- [ ] `FIREBASE_PRIVATE_KEY` est défini dans Vercel (format correct avec `\n`)
- [ ] Les variables sont définies pour l'environnement **Production**
- [ ] Le projet a été redéployé après l'ajout des variables
- [ ] Les index Firestore nécessaires sont créés
- [ ] Les règles Firestore permettent l'accès (ou Admin SDK)

## 🧪 Test rapide

Pour tester si Firebase fonctionne :

1. **Allez sur votre site déployé**
2. **Ouvrez la console du navigateur** (F12)
3. **Entrez un email**
4. **Regardez les erreurs dans la console**
5. **Vérifiez les logs Vercel** pour voir l'erreur exacte côté serveur

## 📞 Message d'erreur amélioré

Avec les dernières corrections, les messages d'erreur sont maintenant plus clairs :
- Si Firebase n'est pas configuré : "Configuration Firebase manquante"
- Si c'est une erreur de connexion : "Erreur de connexion à la base de données"
- Les détails sont affichés en mode développement

## 🔄 Après avoir corrigé

1. **Redéployez** sur Vercel (automatique ou manuel)
2. **Testez à nouveau** l'enregistrement d'email
3. **Vérifiez les logs** si l'erreur persiste

## 📚 Ressources

- [Guide Firebase Setup](./FIREBASE_SETUP.md)
- [Variables d'environnement Vercel](./VERCEL_ENV_VARIABLES.md)
- [Documentation Firebase](https://firebase.google.com/docs)
