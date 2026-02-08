# 📊 Guide du Back Office

## Accès au Back Office

1. Allez sur : **http://localhost:3001/admin/login**
2. Mot de passe par défaut : `admin123`
3. (En production, changez le mot de passe dans `.env.local`)

## Fonctionnalités

### 📈 Dashboard avec Statistiques

- **Nombre total d'utilisateurs** : Tous les emails enregistrés
- **Nombre total d'analyses** : Analyses générées
- **PDF générés** : Nombre de PDF créés avec succès
- **Taux de conversion** : Pourcentage d'utilisateurs ayant complété une analyse

### 📧 Gestion des Emails

#### Liste des Utilisateurs
- Affichage de tous les emails enregistrés
- Date d'inscription
- Nombre d'analyses par utilisateur
- Statut PDF et email envoyé
- Pagination (50 utilisateurs par page)

#### Export CSV
Trois options d'export disponibles :
1. **Tous les emails** : Liste complète de tous les utilisateurs
2. **Emails avec analyse** : Utilisateurs qui ont complété une analyse (pour relance)
3. **Emails sans analyse** : Utilisateurs qui se sont inscrits mais n'ont pas complété (pour conversion)

### 💰 Monétisation

Les exports CSV permettent de :
- **Segmenter votre audience** : Utilisateurs avec/sans analyse
- **Créer des campagnes emailing** : Relancer les utilisateurs
- **Analyser la conversion** : Identifier les emails à relancer
- **Exporter vers des outils marketing** : Import dans Mailchimp, SendGrid, etc.

## Structure des Exports CSV

Le fichier CSV contient :
- **Email** : Adresse email de l'utilisateur
- **Date d'inscription** : Quand l'utilisateur s'est inscrit
- **Nombre d'analyses** : Combien d'analyses ont été faites
- **Statut** : "Avec analyse" ou "Sans analyse"

## Sécurité

- Authentification par mot de passe
- Sessions avec expiration (24h)
- Protection de toutes les routes admin
- Cookie sécurisé en production

## Configuration

Dans `.env.local` :
```env
ADMIN_PASSWORD=admin123
```

**⚠️ Important** : Changez le mot de passe en production !

## Utilisation pour la Monétisation

1. **Exportez les emails avec analyse** → Ciblez les utilisateurs satisfaits pour des offres premium
2. **Exportez les emails sans analyse** → Relancez pour compléter la conversion
3. **Importez dans votre outil d'emailing** → Créez des campagnes personnalisées
4. **Analysez les statistiques** → Identifiez les tendances et optimisez
