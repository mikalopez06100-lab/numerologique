# Application Numérologique

Application Next.js pour l'analyse numérologique personnalisée avec intégration OpenAI.

## Architecture

### Structure des dossiers

```
numerologie-app/
├── app/
│   ├── api/
│   │   └── analyse/
│   │       └── route.ts          # Route API pour l'analyse
│   ├── resultats/
│   │   └── page.tsx              # Page de résultats
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Page d'accueil
│   └── globals.css               # Styles globaux
├── components/
│   ├── ui/
│   │   ├── Input.tsx             # Composant input réutilisable
│   │   └── Button.tsx            # Composant bouton réutilisable
│   ├── FormulaireNumerologie.tsx # Formulaire principal
│   └── SocialProof.tsx           # Preuve sociale
├── lib/
│   ├── numerologie.ts            # Utilitaires numérologiques
│   └── openai.ts                 # Configuration OpenAI
├── types/
│   └── numerologie.ts            # Types TypeScript
└── .env.example                  # Exemple de configuration
```

## Fonctionnalités

### Page d'accueil (`/`)
- Formulaire de saisie avec validation
- Design cosmique avec fond étoilé
- Interface glassmorphism
- Preuve sociale (10 000+ analyses)

### Formulaire
- **Prénom** : Champ texte requis
- **Nom** : Champ texte requis
- **Lieu de naissance** : Champ texte requis
- **Date de naissance** : Format JJ/MM/AAAA avec validation

### Calculs numérologiques
- **Chemin de vie** : Calculé à partir de la date de naissance
- **Nombre d'expression** : Calculé à partir du nom complet
- **Nombre de personnalité** : Calculé à partir du prénom

### API OpenAI
- Génération d'analyse personnalisée
- Parsing automatique de la réponse
- Fallback vers analyse basique si OpenAI n'est pas configuré

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000
```

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Production

```bash
npm run build
npm start
```

## Technologies utilisées

- **Next.js 16** : Framework React
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling
- **OpenAI API** : Génération d'analyses (optionnel)

## Prochaines étapes

1. Configurer la clé API OpenAI dans `.env.local`
2. Améliorer le parsing de la réponse OpenAI
3. Ajouter la persistance des analyses (base de données)
4. Ajouter l'authentification utilisateur
5. Améliorer le design responsive
6. Ajouter des animations supplémentaires
