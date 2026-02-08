# 🗑️ Guide : Supprimer un projet Vercel

Ce guide vous explique comment supprimer l'ancienne version de votre projet sur Vercel.

## 🎯 Méthode 1 : Supprimer via l'interface web (Recommandé)

### Étape 1 : Accéder aux paramètres du projet

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous à votre compte
3. Dans votre dashboard, **trouvez l'ancien projet** (celui qui ne fonctionnait pas)
4. **Cliquez sur le nom du projet** pour l'ouvrir

### Étape 2 : Accéder aux paramètres

1. Une fois dans le projet, cliquez sur l'onglet **"Settings"** en haut
2. Faites défiler jusqu'en bas de la page
3. Vous verrez une section **"Danger Zone"** (Zone de danger)

### Étape 3 : Supprimer le projet

1. Dans la section **"Danger Zone"**, vous verrez :
   - **"Delete Project"** ou **"Supprimer le projet"**
   
2. Cliquez sur **"Delete Project"**

3. Vercel vous demandera de **confirmer** :
   - Tapez le nom du projet pour confirmer
   - Ou cochez la case de confirmation
   - Cliquez sur **"Delete"** ou **"Supprimer"**

4. ⚠️ **Attention** : Cette action est **irréversible** !

### Étape 4 : Vérification

- Le projet devrait disparaître de votre dashboard
- Toutes les URLs associées seront supprimées

## 🔧 Méthode 2 : Supprimer via Vercel CLI

Si vous préférez utiliser la ligne de commande :

### Étape 1 : Installer Vercel CLI (si pas déjà fait)

```bash
npm i -g vercel
```

### Étape 2 : Se connecter

```bash
vercel login
```

### Étape 3 : Lister vos projets

```bash
vercel ls
```

Cela affichera tous vos projets avec leurs IDs.

### Étape 4 : Supprimer le projet

```bash
vercel remove <nom-du-projet>
```

Ou avec l'ID du projet :

```bash
vercel remove <project-id>
```

### Étape 5 : Confirmer

Suivez les instructions pour confirmer la suppression.

## 📋 Méthode 3 : Supprimer uniquement les déploiements

Si vous voulez garder le projet mais supprimer les anciens déploiements :

### Via l'interface web

1. Allez dans votre projet Vercel
2. Cliquez sur l'onglet **"Deployments"**
3. Pour chaque déploiement que vous voulez supprimer :
   - Cliquez sur les **"..."** (trois points) à droite
   - Sélectionnez **"Delete"**
   - Confirmez

## 🔄 Déployer la nouvelle version

Une fois l'ancien projet supprimé, vous pouvez déployer votre nouvelle version :

### Option A : Créer un nouveau projet

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Importez votre repository (la nouvelle version)
4. Configurez les variables d'environnement
5. Déployez

### Option B : Utiliser le même nom

Si vous supprimez l'ancien projet, vous pouvez créer un nouveau projet avec le même nom.

## ⚠️ Points importants

### Avant de supprimer

1. **Sauvegardez les variables d'environnement** :
   - Notez toutes les variables d'environnement de l'ancien projet
   - Vous devrez les réajouter dans le nouveau projet

2. **Notez les domaines personnalisés** :
   - Si vous aviez des domaines personnalisés, notez-les
   - Vous devrez les reconfigurer dans le nouveau projet

3. **Vérifiez les données** :
   - Les données dans Firebase ne seront pas affectées
   - Seul le déploiement Vercel sera supprimé

### Après la suppression

1. **Les URLs seront libres** :
   - L'ancienne URL (ex: `ancien-projet.vercel.app`) sera disponible
   - Vous pouvez créer un nouveau projet avec le même nom

2. **Les données Firebase restent** :
   - Vos données dans Firebase/Firestore ne sont pas supprimées
   - Elles seront accessibles depuis le nouveau déploiement

## 🆘 Problèmes courants

### "I can't find the Delete button"

**Solution** :
- Assurez-vous d'être dans **Settings** (pas dans Overview)
- Faites défiler jusqu'en bas de la page
- La section "Danger Zone" est tout en bas

### "Project not found"

**Solution** :
- Vérifiez que vous êtes connecté au bon compte Vercel
- Vérifiez que le projet existe toujours
- Essayez de rafraîchir la page

### "Permission denied"

**Solution** :
- Assurez-vous d'être le propriétaire du projet
- Si c'est un projet d'équipe, vous devez avoir les permissions d'admin

### "Cannot delete project with active deployments"

**Solution** :
- Supprimez d'abord tous les déploiements
- Ou attendez que les déploiements expirent (si en preview)

## 📝 Checklist

Avant de supprimer :
- [ ] J'ai noté toutes les variables d'environnement
- [ ] J'ai noté les domaines personnalisés (si applicable)
- [ ] Je suis sûr de vouloir supprimer ce projet
- [ ] J'ai sauvegardé les données importantes

Après la suppression :
- [ ] Le projet a disparu du dashboard
- [ ] Je peux créer un nouveau projet avec le même nom (si souhaité)
- [ ] Je suis prêt à déployer la nouvelle version

## 🎯 Étapes recommandées

1. ✅ **Supprimer l'ancien projet** (ce guide)
2. ✅ **Déployer la nouvelle version** (voir [GUIDE_IMPORT_VERCEL.md](./GUIDE_IMPORT_VERCEL.md))
3. ✅ **Configurer les variables d'environnement** (voir [VERCEL_ENV_VARIABLES.md](./VERCEL_ENV_VARIABLES.md))
4. ✅ **Tester le nouveau déploiement**

## 📚 Ressources

- [Documentation Vercel - Delete Project](https://vercel.com/docs/concepts/projects/overview#deleting-a-project)
- [Guide d'import](./GUIDE_IMPORT_VERCEL.md)
- [Guide de déploiement](./DEPLOIEMENT_VERCEL.md)
