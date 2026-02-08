# 📋 Liste complète des variables d'environnement pour Vercel

Voici toutes les variables que vous devez ajouter dans Vercel > Settings > Environment Variables.

## 🔴 Variables OBLIGATOIRES

### 1. OpenAI

**Clé** : `OPENAI_API_KEY`  
**Valeur** : Votre clé API OpenAI  
**Comment l'obtenir** :
1. Allez sur [platform.openai.com](https://platform.openai.com)
2. Connectez-vous
3. Allez dans API Keys
4. Créez une nouvelle clé ou copiez une clé existante
5. Format : `sk-...` (commence par `sk-`)

**Exemple** : `sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

---

**Clé** : `OPENAI_MODEL`  
**Valeur** : `gpt-4o-mini`  
**Note** : Vous pouvez laisser cette valeur par défaut

---

**Clé** : `OPENAI_TEMPERATURE`  
**Valeur** : `0.7`  
**Note** : Vous pouvez laisser cette valeur par défaut

---

**Clé** : `OPENAI_MAX_TOKENS`  
**Valeur** : `4000`  
**Note** : Vous pouvez laisser cette valeur par défaut

---

### 2. Firebase (OBLIGATOIRE)

**Clé** : `FIREBASE_PROJECT_ID`  
**Valeur** : L'ID de votre projet Firebase  
**Comment l'obtenir** :
1. Allez sur [console.firebase.google.com](https://console.firebase.google.com)
2. Sélectionnez votre projet (ou créez-en un)
3. Allez dans Paramètres du projet (icône ⚙️)
4. L'ID du projet est affiché en haut (ex: `mon-projet-123456`)

**Exemple** : `numerologie-app-abc123`

---

**Clé** : `FIREBASE_CLIENT_EMAIL`  
**Valeur** : L'email du compte de service Firebase  
**Comment l'obtenir** :
1. Dans Firebase Console > Paramètres du projet > Comptes de service
2. Cliquez sur "Générer une nouvelle clé privée"
3. Téléchargez le fichier JSON
4. Ouvrez le fichier JSON
5. Copiez la valeur de `client_email`

**Exemple** : `firebase-adminsdk-abc12@numerologie-app-abc123.iam.gserviceaccount.com`

---

**Clé** : `FIREBASE_PRIVATE_KEY`  
**Valeur** : La clé privée Firebase (format spécial)  
**Comment l'obtenir** :
1. Dans le fichier JSON téléchargé (voir ci-dessus)
2. Copiez la valeur de `private_key`
3. **IMPORTANT** : La clé doit être sur **UNE SEULE LIGNE** avec `\n` pour les retours à la ligne
4. Format : `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"`

**Exemple complet** :
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj\nMzEfYyjiWA4R4/M2bN0q7M8z3XK5L8vJ9N2mP4qR7sT1uV3wX5yZ6aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2yZ3aB4cD5eF6gH7iJ8kL9mN0oP1qR2sT3uV4wX5yZ6aB7cD8eF9gH0iJ1kL2mN3oP4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV0wX1yZ2aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8aB9cD0eF1gH2iJ3kL4mN5oP6qR7sT8uV9wX0yZ1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4aB5cD6eF7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ7aB8cD9eF0gH1iJ2kL3mN4oP5qR6sT7uV8wX9yZ0aB\n-----END PRIVATE KEY-----\n"
```

**⚠️ ATTENTION** :
- La clé doit être entre guillemets `"`
- Les retours à la ligne dans la clé doivent être remplacés par `\n`
- Ne pas avoir de retours à la ligne réels dans Vercel

---

### 3. Email SMTP (OBLIGATOIRE)

**Clé** : `SMTP_HOST`  
**Valeur** : `smtp.gmail.com`  
**Note** : Si vous utilisez Gmail, gardez cette valeur

---

**Clé** : `SMTP_PORT`  
**Valeur** : `587`  
**Note** : Port standard pour Gmail

---

**Clé** : `SMTP_SECURE`  
**Valeur** : `false`  
**Note** : Pour le port 587, utilisez `false`

---

**Clé** : `SMTP_USER`  
**Valeur** : Votre adresse email Gmail  
**Exemple** : `votre.email@gmail.com`

---

**Clé** : `SMTP_PASS`  
**Valeur** : Votre mot de passe d'application Gmail  
**Comment l'obtenir** :
1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Sécurité > Validation en deux étapes (activez-la si pas déjà fait)
3. Mots de passe des applications
4. Sélectionnez "Autre (nom personnalisé)" : "Numerologie App"
5. Générez le mot de passe
6. **Copiez ce mot de passe** (vous ne pourrez plus le voir après)

**Exemple** : `abcd efgh ijkl mnop`

**⚠️ IMPORTANT** : Utilisez un **mot de passe d'application**, pas votre mot de passe Gmail normal !

---

**Clé** : `EMAIL_FROM`  
**Valeur** : `Numerologie App <votre.email@gmail.com>`  
**Exemple** : `Numerologie App <votre.email@gmail.com>`

---

**Clé** : `EMAIL_SERVICE`  
**Valeur** : `gmail`  
**Note** : Si vous utilisez Gmail, gardez cette valeur

---

### 4. Admin (OBLIGATOIRE)

**Clé** : `ADMIN_PASSWORD`  
**Valeur** : Un mot de passe fort pour accéder au back office  
**Exemple** : `MonMotDePasseFort123!`  
**Note** : Choisissez un mot de passe sécurisé

---

## 🟡 Variables OPTIONNELLES (avec valeurs par défaut)

### Rate Limiting

**Clé** : `RATE_LIMIT_DAILY`  
**Valeur** : `50`  
**Note** : Nombre maximum d'analyses par jour (par défaut : 50)

---

**Clé** : `RATE_LIMIT_HOURLY`  
**Valeur** : `10`  
**Note** : Nombre maximum d'analyses par heure (par défaut : 10)

---

**Clé** : `RATE_LIMIT_PER_MINUTE`  
**Valeur** : `3`  
**Note** : Nombre maximum d'analyses par minute (par défaut : 3)

---

**Clé** : `NEXT_PUBLIC_BASE_URL`  
**Valeur** : L'URL de votre site Vercel  
**Exemple** : `https://votre-projet.vercel.app`  
**Note** : Vercel définit automatiquement cette variable, mais vous pouvez la personnaliser

---

## 📝 Résumé rapide - Checklist

### Variables à ajouter dans Vercel :

```
✅ OPENAI_API_KEY = sk-...
✅ OPENAI_MODEL = gpt-4o-mini
✅ OPENAI_TEMPERATURE = 0.7
✅ OPENAI_MAX_TOKENS = 4000

✅ FIREBASE_PROJECT_ID = votre-project-id
✅ FIREBASE_CLIENT_EMAIL = votre-email@project.iam.gserviceaccount.com
✅ FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

✅ SMTP_HOST = smtp.gmail.com
✅ SMTP_PORT = 587
✅ SMTP_SECURE = false
✅ SMTP_USER = votre.email@gmail.com
✅ SMTP_PASS = votre_mot_de_passe_application
✅ EMAIL_FROM = "Numerologie App <votre.email@gmail.com>"
✅ EMAIL_SERVICE = gmail

✅ ADMIN_PASSWORD = votre_mot_de_passe_admin

(Optionnel)
RATE_LIMIT_DAILY = 50
RATE_LIMIT_HOURLY = 10
RATE_LIMIT_PER_MINUTE = 3
NEXT_PUBLIC_BASE_URL = https://votre-projet.vercel.app
```

## 🎯 Instructions étape par étape

### Étape 1 : Obtenir les credentials Firebase

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com)
2. Créez un projet ou sélectionnez un projet existant
3. Activez **Firestore Database** :
   - Allez dans Firestore Database
   - Cliquez sur "Créer une base de données"
   - Choisissez "Démarrer en mode test" (vous changerez les règles après)
   - Sélectionnez une région (ex: `europe-west`)
4. Créez un compte de service :
   - Paramètres du projet (⚙️) > Comptes de service
   - Cliquez sur "Générer une nouvelle clé privée"
   - Téléchargez le fichier JSON
5. Ouvrez le fichier JSON et notez :
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (format spécial, voir ci-dessus)

### Étape 2 : Obtenir la clé OpenAI

1. Allez sur [platform.openai.com](https://platform.openai.com)
2. API Keys > Create new secret key
3. Copiez la clé (commence par `sk-`)

### Étape 3 : Configurer Gmail SMTP

1. Activez la validation en 2 étapes sur votre compte Google
2. Générez un mot de passe d'application (voir instructions ci-dessus)
3. Utilisez votre email Gmail et ce mot de passe

### Étape 4 : Ajouter dans Vercel

1. Allez sur [vercel.com](https://vercel.com) > Votre projet
2. Settings > Environment Variables
3. Pour chaque variable :
   - Cliquez sur "Add New"
   - Entrez la clé
   - Entrez la valeur
   - Sélectionnez les environnements : ✅ Production, ✅ Preview, ✅ Development
   - Cliquez sur "Save"

### Étape 5 : Redéployer

1. Après avoir ajouté toutes les variables
2. Allez dans Deployments
3. Cliquez sur "..." sur le dernier déploiement
4. Cliquez sur "Redeploy"
5. OU attendez que Vercel redéploie automatiquement

## ⚠️ Points importants

### FIREBASE_PRIVATE_KEY - Format spécial

La clé privée Firebase doit être sur **UNE SEULE LIGNE** dans Vercel :

**❌ MAUVAIS** (avec retours à la ligne réels) :
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

**✅ BON** (avec `\n` pour les retours à la ligne) :
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Comment convertir** :
1. Ouvrez le fichier JSON Firebase
2. Copiez la valeur de `private_key`
3. Remplacez tous les retours à la ligne réels par `\n`
4. Ajoutez des guillemets au début et à la fin
5. Collez dans Vercel

### SMTP_PASS - Mot de passe d'application

**❌ NE PAS utiliser** : Votre mot de passe Gmail normal  
**✅ UTILISER** : Un mot de passe d'application généré (voir instructions ci-dessus)

## 🧪 Test après configuration

1. Redéployez sur Vercel
2. Allez sur votre site
3. Entrez un email
4. Si ça fonctionne : ✅ Configuration correcte
5. Si erreur : Vérifiez les logs Vercel pour voir quelle variable manque

## 📚 Guides complémentaires

- [Configuration Firebase détaillée](./FIREBASE_SETUP.md)
- [Variables d'environnement Vercel](./VERCEL_ENV_VARIABLES.md)
- [Dépannage Firebase](./DEBUG_FIREBASE_VERCEL.md)
