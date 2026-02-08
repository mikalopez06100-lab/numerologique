# 🚀 Déploiement Vercel - Guide Rapide

## Déploiement en 5 minutes

### 1. Préparer votre code
```bash
# Assurez-vous que tout est commité
git add .
git commit -m "Prêt pour Vercel"
git push
```

### 2. Connecter à Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Importez votre repository Git
4. Vercel détectera automatiquement Next.js ✅

### 3. Configurer les variables d'environnement

Dans Vercel > Settings > Environment Variables, ajoutez :

**Obligatoires :**
- `OPENAI_API_KEY`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (format : `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`)
- `SMTP_USER`
- `SMTP_PASS`
- `ADMIN_PASSWORD`

**Optionnelles :**
- `OPENAI_MODEL` (défaut: `gpt-4o-mini`)
- `RATE_LIMIT_DAILY` (défaut: `50`)
- `NEXT_PUBLIC_BASE_URL` (auto-détecté par Vercel)

### 4. Déployer
Cliquez sur **"Deploy"** et attendez 2-3 minutes ! 🎉

## 📚 Documentation complète

- [Guide de déploiement détaillé](./DEPLOIEMENT_VERCEL.md)
- [Variables d'environnement](./VERCEL_ENV_VARIABLES.md)
- [Configuration Firebase](./FIREBASE_SETUP.md)

## ✅ Checklist rapide

- [ ] Code sur Git (GitHub/GitLab/Bitbucket)
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Firebase configuré avec Firestore
- [ ] Déploiement réussi
- [ ] Tests de production réussis

## 🆘 Besoin d'aide ?

Consultez [DEPLOIEMENT_VERCEL.md](./DEPLOIEMENT_VERCEL.md) pour plus de détails.
