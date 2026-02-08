# Guide de Configuration OpenAI - Étape par Étape

## 📋 Étape 1 : Obtenir une clé API OpenAI

1. **Allez sur le site OpenAI** : https://platform.openai.com/
2. **Créez un compte** ou **connectez-vous** si vous en avez déjà un
3. **Accédez à la section API Keys** :
   - Cliquez sur votre profil (en haut à droite)
   - Sélectionnez "API keys" ou allez directement sur : https://platform.openai.com/api-keys
4. **Créez une nouvelle clé** :
   - Cliquez sur "Create new secret key"
   - Donnez-lui un nom (ex: "Numerologie App")
   - **IMPORTANT** : Copiez la clé immédiatement, vous ne pourrez plus la voir après !
   - Collez-la dans un endroit sûr temporairement

## 📝 Étape 2 : Créer le fichier de configuration

Créez un fichier `.env.local` à la racine du projet `numerologie-app/` avec le contenu suivant :

```env
OPENAI_API_KEY=votre_cle_api_ici
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=4000
```

**Remplacez `votre_cle_api_ici` par votre vraie clé API.**

## ⚙️ Étape 3 : Redémarrer le serveur de développement

Après avoir créé le fichier `.env.local`, vous devez redémarrer le serveur Next.js pour que les variables d'environnement soient chargées.

## ✅ Étape 4 : Tester la configuration

Une fois le serveur redémarré, testez le formulaire sur http://localhost:3001 pour vérifier que tout fonctionne.

## 💡 Notes importantes

- Le fichier `.env.local` est déjà dans `.gitignore`, donc votre clé API ne sera pas commitée
- Le modèle `gpt-4o-mini` est économique et rapide
- Vous pouvez ajuster `TEMPERATURE` (0.0-1.0) pour plus ou moins de créativité
- `MAX_TOKENS` est fixé à 4000 pour permettre des analyses complètes

## 🔒 Sécurité

- Ne partagez jamais votre clé API
- Ne commitez pas le fichier `.env.local`
- Si votre clé est compromise, supprimez-la et créez-en une nouvelle sur OpenAI
