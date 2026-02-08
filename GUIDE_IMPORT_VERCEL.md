# 📦 Guide : Importer votre repository sur Vercel

Ce guide vous explique étape par étape comment importer votre projet sur Vercel.

## 🎯 Prérequis

Avant de commencer, assurez-vous que :
- ✅ Votre code est sur GitHub, GitLab ou Bitbucket
- ✅ Vous avez un compte Vercel (gratuit) : [vercel.com/signup](https://vercel.com/signup)

## 📝 Méthode 1 : Via l'interface web Vercel (Recommandé)

### Étape 1 : Se connecter à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** ou **"Log In"** en haut à droite
3. Connectez-vous avec :
   - GitHub (recommandé)
   - GitLab
   - Bitbucket
   - Email

### Étape 2 : Accéder à "Add New Project"

1. Une fois connecté, vous verrez votre dashboard Vercel
2. Cliquez sur le bouton **"Add New..."** ou **"New Project"**
   - Il se trouve généralement en haut à droite ou au centre de la page

### Étape 3 : Importer depuis Git

1. Vercel vous montrera une liste de vos repositories Git
2. **Si votre repository n'apparaît pas** :
   - Cliquez sur **"Adjust GitHub App Permissions"** (ou équivalent pour GitLab/Bitbucket)
   - Autorisez Vercel à accéder à vos repositories
   - Sélectionnez **"All repositories"** ou votre repository spécifique
   - Rechargez la page Vercel (F5)

3. **Trouvez votre repository** :
   - Utilisez la barre de recherche pour trouver `numerologique` ou le nom de votre repo
   - Ou parcourez la liste
   - Vérifiez que vous êtes connecté au bon compte Git

4. **Si vous ne trouvez toujours pas votre repository** :
   - 📖 Consultez le guide complet : [REPOSITORY_NON_TROUVE.md](./REPOSITORY_NON_TROUVE.md)
   - Ou la version rapide : [REPOSITORY_NON_TROUVE_RAPIDE.md](./REPOSITORY_NON_TROUVE_RAPIDE.md)

5. **Cliquez sur votre repository** pour le sélectionner

### Étape 4 : Configurer le projet

Vercel détectera automatiquement :
- ✅ Framework : Next.js
- ✅ Build Command : `npm run build`
- ✅ Output Directory : `.next`
- ✅ Install Command : `npm install`

**Vous pouvez laisser les valeurs par défaut** ou les modifier si nécessaire.

### Étape 5 : Configurer les variables d'environnement

**⚠️ IMPORTANT : Configurez les variables AVANT de déployer**

1. Cliquez sur **"Environment Variables"** pour les ajouter
2. Ajoutez chaque variable une par une :

```
OPENAI_API_KEY=votre_clé
FIREBASE_PROJECT_ID=votre_project_id
FIREBASE_CLIENT_EMAIL=votre_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SMTP_USER=votre_email
SMTP_PASS=votre_mot_de_passe
ADMIN_PASSWORD=votre_mot_de_passe_admin
```

3. Pour chaque variable, sélectionnez les environnements :
   - ✅ Production
   - ✅ Preview (optionnel)
   - ✅ Development (optionnel)

4. Cliquez sur **"Add"** pour chaque variable

**💡 Astuce** : Vous pouvez aussi les ajouter après le déploiement, mais il faudra redéployer.

### Étape 6 : Déployer

1. Cliquez sur le bouton **"Deploy"** en bas de la page
2. Attendez 2-3 minutes pendant que Vercel :
   - Installe les dépendances
   - Build votre application
   - Déploie sur leurs serveurs

3. Une fois terminé, vous verrez :
   - ✅ Un lien vers votre site déployé (ex: `https://votre-projet.vercel.app`)
   - ✅ Les logs de build
   - ✅ Un bouton "Visit" pour voir votre site

### Étape 7 : Vérifier le déploiement

1. Cliquez sur **"Visit"** pour ouvrir votre site
2. Testez les fonctionnalités :
   - Page d'accueil
   - Enregistrement d'email
   - Création d'analyse
   - Back office

## 🔧 Méthode 2 : Via Vercel CLI

Si vous préférez utiliser la ligne de commande :

### Étape 1 : Installer Vercel CLI

```bash
npm i -g vercel
```

### Étape 2 : Se connecter

```bash
vercel login
```

Cela ouvrira votre navigateur pour vous connecter.

### Étape 3 : Aller dans le dossier du projet

```bash
cd numerologie-app
```

### Étape 4 : Déployer

```bash
vercel
```

Suivez les instructions :
1. **Set up and deploy?** → `Y`
2. **Which scope?** → Sélectionnez votre compte
3. **Link to existing project?** → `N` (pour créer un nouveau projet)
4. **What's your project's name?** → Entrez un nom (ex: `numerologie-app`)
5. **In which directory is your code located?** → `./` (appuyez sur Entrée)
6. **Want to override the settings?** → `N` (laissez les valeurs par défaut)

### Étape 5 : Ajouter les variables d'environnement

```bash
# Ajouter une variable
vercel env add OPENAI_API_KEY

# Suivez les instructions :
# - Entrez la valeur
# - Sélectionnez les environnements (Production, Preview, Development)
```

Répétez pour chaque variable.

### Étape 6 : Déployer en production

```bash
vercel --prod
```

## 🖼️ Capture d'écran des étapes clés

### Étape 1 : Dashboard Vercel
```
┌─────────────────────────────────────┐
│  Vercel Dashboard                    │
│                                      │
│  [Add New...]  [New Project]        │
│                                      │
│  Vos projets apparaîtront ici       │
└─────────────────────────────────────┘
```

### Étape 2 : Sélection du repository
```
┌─────────────────────────────────────┐
│  Import Git Repository               │
│                                      │
│  🔍 Rechercher...                   │
│                                      │
│  📦 numerologique                   │
│  📦 autre-projet                     │
│  📦 mon-autre-repo                   │
└─────────────────────────────────────┘
```

### Étape 3 : Configuration
```
┌─────────────────────────────────────┐
│  Configure Project                   │
│                                      │
│  Framework Preset: Next.js ✅        │
│  Root Directory: ./                  │
│  Build Command: npm run build         │
│  Output Directory: .next             │
│                                      │
│  [Environment Variables]             │
│  [Deploy]                           │
└─────────────────────────────────────┘
```

## ❓ Problèmes courants

### "Repository not found"
- **Solution** : Vérifiez que vous avez autorisé Vercel à accéder à vos repositories
- Allez dans les paramètres de votre compte Git (GitHub/GitLab) > Applications > Vercel
- Autorisez l'accès aux repositories

### "Build failed"
- **Solution** : Vérifiez les logs de build dans Vercel
- Assurez-vous que toutes les dépendances sont dans `package.json`
- Vérifiez que `npm run build` fonctionne localement

### "Environment variables missing"
- **Solution** : Ajoutez toutes les variables d'environnement requises
- Consultez `VERCEL_ENV_VARIABLES.md` pour la liste complète
- Redéployez après avoir ajouté les variables

### "Cannot find module"
- **Solution** : Vérifiez que toutes les dépendances sont installées
- Vérifiez que `package.json` contient toutes les dépendances nécessaires
- Vérifiez les logs de build pour voir quelle dépendance manque

## ✅ Checklist avant l'import

- [ ] Code commité et poussé sur Git (GitHub/GitLab/Bitbucket)
- [ ] Compte Vercel créé
- [ ] Repository accessible depuis Vercel
- [ ] Variables d'environnement prêtes (liste dans `VERCEL_ENV_VARIABLES.md`)
- [ ] Firebase configuré
- [ ] Test local réussi (`npm run build` fonctionne)

## 🎉 Après l'import

Une fois votre projet importé et déployé :

1. **Notez l'URL de votre site** : `https://votre-projet.vercel.app`
2. **Configurez un domaine personnalisé** (optionnel) :
   - Settings > Domains
   - Ajoutez votre domaine
   - Configurez les DNS

3. **Surveillez les déploiements** :
   - Chaque push sur votre branche principale déclenchera un nouveau déploiement
   - Les branches créent des "preview deployments"

4. **Consultez les logs** :
   - Chaque déploiement a ses propres logs
   - Utilisez-les pour déboguer

## 📚 Ressources

- [Documentation Vercel - Import Project](https://vercel.com/docs/concepts/projects/overview)
- [Guide de déploiement complet](./DEPLOIEMENT_VERCEL.md)
- [Variables d'environnement](./VERCEL_ENV_VARIABLES.md)

## 🆘 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Consultez les logs de build dans Vercel
2. Vérifiez que `npm run build` fonctionne localement
3. Consultez la [documentation Vercel](https://vercel.com/docs)
