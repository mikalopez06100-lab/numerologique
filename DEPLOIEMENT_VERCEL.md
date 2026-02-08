# Guide de déploiement sur Vercel

Ce guide vous explique comment déployer votre application de numérologie sur Vercel.

## 📋 Prérequis

1. Un compte Vercel (gratuit) : [vercel.com](https://vercel.com)
2. Un compte Firebase avec Firestore configuré
3. Toutes les clés API nécessaires (OpenAI, SMTP, etc.)

## 🚀 Déploiement rapide

### Option 1 : Déploiement via l'interface Vercel (Recommandé)

1. **Préparer votre repository Git**
   - Assurez-vous que votre code est sur GitHub, GitLab ou Bitbucket
   - Vérifiez que tous les fichiers sont commités

2. **Connecter votre projet à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre repository Git
   - Vercel détectera automatiquement Next.js
   
   📖 **Guide détaillé** : Consultez [GUIDE_IMPORT_VERCEL.md](./GUIDE_IMPORT_VERCEL.md) pour les instructions étape par étape avec captures d'écran

3. **Configurer les variables d'environnement**
   - Dans la section "Environment Variables", ajoutez toutes les variables nécessaires :
   
   ```
   # OpenAI
   OPENAI_API_KEY=votre_clé_openai
   OPENAI_MODEL=gpt-4o-mini
   OPENAI_TEMPERATURE=0.7
   OPENAI_MAX_TOKENS=4000
   
   # Rate Limiting
   RATE_LIMIT_DAILY=50
   RATE_LIMIT_HOURLY=10
   RATE_LIMIT_PER_MINUTE=3
   
   # Firebase
   FIREBASE_PROJECT_ID=votre-project-id
   FIREBASE_CLIENT_EMAIL=votre-email@votre-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée\n-----END PRIVATE KEY-----\n"
   
   # Email SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=votre_email@gmail.com
   SMTP_PASS=votre_mot_de_passe_application
   EMAIL_FROM="Numerologie App <noreply@numerologie.app>"
   EMAIL_SERVICE=gmail
   
   # Admin
   ADMIN_PASSWORD=votre_mot_de_passe_admin
   
   # URL de base (sera automatiquement défini par Vercel)
   NEXT_PUBLIC_BASE_URL=https://votre-projet.vercel.app
   ```

4. **Déployer**
   - Cliquez sur "Deploy"
   - Vercel va construire et déployer votre application
   - Le déploiement prend généralement 2-3 minutes

### Option 2 : Déploiement via CLI Vercel

1. **Installer Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Se connecter à Vercel**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   cd numerologie-app
   vercel
   ```
   
   Suivez les instructions pour :
   - Lier votre projet à un projet Vercel existant ou en créer un nouveau
   - Configurer les variables d'environnement

4. **Déployer en production**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration des variables d'environnement

### Variables obligatoires

| Variable | Description | Exemple |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Clé API OpenAI | `sk-...` |
| `FIREBASE_PROJECT_ID` | ID du projet Firebase | `mon-projet-123` |
| `FIREBASE_CLIENT_EMAIL` | Email du compte de service Firebase | `service@...` |
| `FIREBASE_PRIVATE_KEY` | Clé privée Firebase | `-----BEGIN PRIVATE KEY-----\n...` |
| `SMTP_USER` | Email SMTP | `votre@email.com` |
| `SMTP_PASS` | Mot de passe SMTP | `votre_mot_de_passe` |

### Variables optionnelles

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `OPENAI_MODEL` | Modèle OpenAI | `gpt-4o-mini` |
| `RATE_LIMIT_DAILY` | Limite quotidienne | `50` |
| `ADMIN_PASSWORD` | Mot de passe admin | `admin123` |
| `NEXT_PUBLIC_BASE_URL` | URL de base | Auto-détecté par Vercel |

### Configuration de FIREBASE_PRIVATE_KEY sur Vercel

⚠️ **Important** : La clé privée Firebase doit être sur une seule ligne avec `\n` pour les retours à la ligne.

**Méthode 1 : Via l'interface Vercel**
1. Copiez votre clé privée complète
2. Remplacez les retours à la ligne par `\n`
3. Collez dans le champ de variable d'environnement

**Méthode 2 : Via CLI**
```bash
vercel env add FIREBASE_PRIVATE_KEY
# Collez votre clé privée (avec \n pour les retours à la ligne)
```

## 📝 Configuration Firebase pour la production

1. **Vérifier les règles Firestore**
   - Allez dans Firebase Console > Firestore > Règles
   - Assurez-vous que les règles de sécurité sont correctes
   - En production, utilisez des règles strictes :

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Les règles doivent être gérées côté serveur via Firebase Admin SDK
       // Cette règle bloque tout accès direct depuis le client
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```

2. **Créer les index Firestore nécessaires**
   - Firebase vous proposera automatiquement de créer les index manquants
   - Ou créez-les manuellement dans Firestore > Index

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne jamais commit les variables d'environnement**
   - Vérifiez que `.env.local` est dans `.gitignore`
   - Utilisez uniquement les variables d'environnement Vercel

2. **Utiliser des mots de passe forts**
   - Changez `ADMIN_PASSWORD` pour un mot de passe fort
   - Utilisez un hash bcrypt pour la production

3. **Limiter les accès Firebase**
   - Le compte de service Firebase doit avoir uniquement les permissions nécessaires
   - Ne partagez jamais les clés privées

4. **Configurer les domaines personnalisés**
   - Dans Vercel, ajoutez votre domaine personnalisé
   - Configurez les enregistrements DNS

## 🧪 Tests après déploiement

1. **Tester l'authentification**
   - Accédez à votre site déployé
   - Testez l'enregistrement d'un email
   - Vérifiez que l'authentification fonctionne

2. **Tester la création d'analyse**
   - Créez une nouvelle analyse
   - Vérifiez dans Firebase que les données sont créées
   - Vérifiez que le PDF est généré
   - Vérifiez que l'email est envoyé

3. **Tester le back office**
   - Accédez à `/admin/login`
   - Connectez-vous avec le mot de passe admin
   - Vérifiez les statistiques et la liste des utilisateurs

4. **Tester les autres études**
   - Testez chaque type d'étude (année personnelle, compatibilité, etc.)
   - Vérifiez que tout fonctionne correctement

## 🐛 Dépannage

### Erreur : "FIREBASE_PROJECT_ID n'est pas défini"
- Vérifiez que toutes les variables Firebase sont bien configurées dans Vercel
- Redéployez après avoir ajouté les variables

### Erreur : "Failed to load external module"
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les logs de build dans Vercel

### Erreur : "Missing or insufficient permissions" (Firebase)
- Vérifiez que le compte de service Firebase a les bonnes permissions
- Vérifiez les règles Firestore

### Erreur : Timeout des fonctions
- Les fonctions API ont un timeout de 60 secondes (configuré dans `vercel.json`)
- Si nécessaire, augmentez `maxDuration` dans `vercel.json`

### Les emails ne sont pas envoyés
- Vérifiez les variables SMTP dans Vercel
- Vérifiez les logs Vercel pour les erreurs d'envoi
- Testez avec un service SMTP de test (comme Mailtrap)

## 📊 Monitoring

1. **Logs Vercel**
   - Accédez à votre projet Vercel > Logs
   - Surveillez les erreurs et les performances

2. **Firebase Console**
   - Surveillez l'utilisation de Firestore
   - Vérifiez les quotas et limites

3. **OpenAI Dashboard**
   - Surveillez l'utilisation de l'API OpenAI
   - Vérifiez les coûts

## 🔄 Mises à jour

Pour mettre à jour votre application :

1. **Via Git** (recommandé)
   ```bash
   git add .
   git commit -m "Mise à jour"
   git push
   ```
   Vercel déploiera automatiquement les changements

2. **Via Vercel CLI**
   ```bash
   vercel --prod
   ```

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Firebase](https://firebase.google.com/docs)
- [Guide Firebase Setup](./FIREBASE_SETUP.md)

## ✅ Checklist de déploiement

- [ ] Repository Git configuré
- [ ] Toutes les variables d'environnement configurées dans Vercel
- [ ] Firebase configuré avec Firestore
- [ ] Index Firestore créés
- [ ] Règles Firestore configurées
- [ ] Tests locaux réussis
- [ ] Déploiement Vercel réussi
- [ ] Tests de production réussis
- [ ] Domaines personnalisés configurés (si nécessaire)
- [ ] Monitoring configuré
