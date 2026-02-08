# Variables d'environnement pour Vercel

Ce fichier liste toutes les variables d'environnement nécessaires pour le déploiement sur Vercel.

## 📋 Liste complète des variables

### 🔴 Obligatoires

#### OpenAI
```
OPENAI_API_KEY=sk-votre-clé-api-openai
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=4000
```

#### Firebase
```
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_CLIENT_EMAIL=votre-email@votre-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée complète ici\n-----END PRIVATE KEY-----\n"
```

#### Email SMTP
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
EMAIL_FROM="Numerologie App <noreply@numerologie.app>"
EMAIL_SERVICE=gmail
```

#### Admin
```
ADMIN_PASSWORD=votre_mot_de_passe_admin_fort
```

### 🟡 Optionnelles (avec valeurs par défaut)

#### Rate Limiting
```
RATE_LIMIT_DAILY=50
RATE_LIMIT_HOURLY=10
RATE_LIMIT_PER_MINUTE=3
```

#### URL de base
```
NEXT_PUBLIC_BASE_URL=https://votre-projet.vercel.app
```
**Note** : Vercel définit automatiquement cette variable, mais vous pouvez la personnaliser.

## 🔧 Comment ajouter les variables dans Vercel

### Méthode 1 : Interface Web (Recommandé)

1. Allez sur votre projet Vercel
2. Cliquez sur **Settings** > **Environment Variables**
3. Pour chaque variable :
   - Cliquez sur **Add New**
   - Entrez le nom de la variable
   - Entrez la valeur
   - Sélectionnez les environnements (Production, Preview, Development)
   - Cliquez sur **Save**

### Méthode 2 : CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Ajouter une variable
vercel env add OPENAI_API_KEY
# Suivez les instructions pour entrer la valeur

# Lister les variables
vercel env ls

# Supprimer une variable
vercel env rm OPENAI_API_KEY
```

## ⚠️ Notes importantes

### FIREBASE_PRIVATE_KEY

La clé privée Firebase doit être sur **une seule ligne** avec `\n` pour représenter les retours à la ligne.

**Exemple correct** :
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Comment obtenir la clé** :
1. Allez dans Firebase Console > Paramètres du projet > Comptes de service
2. Cliquez sur "Générer une nouvelle clé privée"
3. Téléchargez le fichier JSON
4. Copiez la valeur de `private_key` du JSON
5. Remplacez les retours à la ligne réels par `\n`

### SMTP_PASS (Gmail)

Pour Gmail, vous devez utiliser un **mot de passe d'application** et non votre mot de passe Gmail normal :

1. Allez dans votre compte Google > Sécurité
2. Activez la validation en 2 étapes
3. Générez un mot de passe d'application
4. Utilisez ce mot de passe dans `SMTP_PASS`

### Environnements

Vous pouvez définir des variables différentes pour :
- **Production** : Variables utilisées en production
- **Preview** : Variables pour les déploiements de prévisualisation (branches)
- **Development** : Variables pour le développement local

## 🔒 Sécurité

1. **Ne jamais commit les variables d'environnement**
   - Vérifiez que `.env.local` est dans `.gitignore`
   - Ne partagez jamais les valeurs des variables

2. **Utiliser des mots de passe forts**
   - `ADMIN_PASSWORD` doit être un mot de passe fort
   - En production, considérez l'utilisation d'un hash bcrypt

3. **Rotation des clés**
   - Changez régulièrement les clés API
   - Surveillez l'utilisation dans les dashboards respectifs

## ✅ Checklist

Avant de déployer, vérifiez que vous avez :

- [ ] `OPENAI_API_KEY` configuré
- [ ] `FIREBASE_PROJECT_ID` configuré
- [ ] `FIREBASE_CLIENT_EMAIL` configuré
- [ ] `FIREBASE_PRIVATE_KEY` configuré (format correct avec `\n`)
- [ ] `SMTP_USER` configuré
- [ ] `SMTP_PASS` configuré (mot de passe d'application pour Gmail)
- [ ] `ADMIN_PASSWORD` configuré (mot de passe fort)
- [ ] Toutes les variables sont définies pour l'environnement **Production**

## 🧪 Test des variables

Après avoir configuré les variables, testez votre déploiement :

1. Déployez sur Vercel
2. Vérifiez les logs de build (doivent être sans erreur)
3. Testez l'application déployée
4. Vérifiez les logs Vercel en cas d'erreur

## 📚 Ressources

- [Documentation Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Guide de déploiement](./DEPLOIEMENT_VERCEL.md)
- [Configuration Firebase](./FIREBASE_SETUP.md)
