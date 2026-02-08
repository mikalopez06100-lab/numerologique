# Configuration Firebase

Ce projet utilise Firebase Firestore pour le stockage des données au lieu de SQLite/Prisma.

## Configuration initiale

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez **Firestore Database** dans le menu

### 2. Créer un compte de service

1. Dans Firebase Console, allez dans **Paramètres du projet** > **Comptes de service**
2. Cliquez sur **Générer une nouvelle clé privée**
3. Téléchargez le fichier JSON

### 3. Configurer les variables d'environnement

Vous avez deux options pour configurer Firebase :

#### Option 1 : Variables individuelles (recommandé)

Ajoutez dans votre fichier `.env.local` :

```env
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_CLIENT_EMAIL=votre-email@votre-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée ici\n-----END PRIVATE KEY-----\n"
```

**Important** : La clé privée doit être sur une seule ligne avec `\n` pour les retours à la ligne.

#### Option 2 : JSON complet

Ajoutez dans votre fichier `.env.local` :

```env
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

### 4. Créer les index Firestore

Firestore nécessite des index pour certaines requêtes. Créez ces index dans la console Firebase :

#### Index pour la collection `users` :
- Collection: `users`
- Champs indexés:
  - `createdAt` (Ascendant)

#### Index pour la collection `analyses` :
- Collection: `analyses`
- Champs indexés:
  - `userId` (Ascendant)
  - `createdAt` (Descendant)

#### Index composite pour les requêtes avec filtres :
- Collection: `analyses`
- Champs indexés:
  - `pdfGenerated` (Ascendant)
  - `createdAt` (Descendant)

- Collection: `analyses`
- Champs indexés:
  - `emailSent` (Ascendant)
  - `createdAt` (Descendant)

**Note** : Firebase vous proposera automatiquement de créer ces index si vous essayez d'exécuter une requête qui en nécessite un.

## Migration des données existantes

Si vous avez des données dans SQLite que vous souhaitez migrer vers Firebase, vous pouvez créer un script de migration. Contactez le développeur pour plus d'informations.

## Structure des collections

### Collection `users`
```typescript
{
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection `analyses`
```typescript
{
  userId: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
  cheminDeVie: number;
  nombreExpression: number;
  nombreIntime: number;
  analyseData: string; // JSON stringifié
  pdfGenerated: boolean;
  emailSent: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Vérification

Pour vérifier que Firebase est correctement configuré :

1. Démarrez le serveur : `npm run dev`
2. Essayez de créer une analyse
3. Vérifiez dans la console Firebase que les données sont bien créées

## Dépannage

### Erreur : "FIREBASE_PROJECT_ID n'est pas défini"
- Vérifiez que vous avez bien ajouté `FIREBASE_PROJECT_ID` dans `.env.local`

### Erreur : "Missing or insufficient permissions"
- Vérifiez que votre compte de service a les permissions nécessaires dans Firebase
- Allez dans Firestore > Règles et assurez-vous que les règles permettent l'accès

### Erreur : "Index required"
- Créez les index manquants dans la console Firebase (Firestore > Index)
- Firebase vous donnera un lien direct pour créer l'index nécessaire
