# ⚡ Import Vercel - Guide Ultra Rapide

## En 3 étapes simples

### 1️⃣ Aller sur Vercel
👉 [vercel.com](https://vercel.com) → **"Add New Project"**

### 2️⃣ Sélectionner votre repository
- Trouvez `numerologique` dans la liste
- Cliquez dessus

### 3️⃣ Configurer et déployer
- Ajoutez les variables d'environnement (voir ci-dessous)
- Cliquez sur **"Deploy"**
- Attendez 2-3 minutes ✅

## 🔑 Variables à ajouter (avant de déployer)

Dans **Settings > Environment Variables**, ajoutez :

```
OPENAI_API_KEY=votre_clé
FIREBASE_PROJECT_ID=votre_project_id
FIREBASE_CLIENT_EMAIL=votre_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SMTP_USER=votre_email
SMTP_PASS=votre_mot_de_passe
ADMIN_PASSWORD=votre_mot_de_passe_admin
```

## 📖 Guide détaillé

Pour les instructions complètes avec captures d'écran :
👉 [GUIDE_IMPORT_VERCEL.md](./GUIDE_IMPORT_VERCEL.md)

## ❓ Problème ?

- Repository non trouvé ? → Autorisez Vercel dans les paramètres GitHub/GitLab
- Build échoue ? → Vérifiez les logs dans Vercel
- Variables manquantes ? → Ajoutez-les et redéployez
