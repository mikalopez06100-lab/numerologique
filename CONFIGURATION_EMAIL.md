# Configuration de l'Envoi d'Email

## 📧 Configuration SMTP

Pour activer l'envoi d'emails (lien d'authentification et PDF), ajoutez ces variables dans votre fichier `.env.local` :

### Option 1 : Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_application
EMAIL_FROM="Numerologie App <votre_email@gmail.com>"
EMAIL_SERVICE=gmail
```

**Important pour Gmail :**
1. Activez l'authentification à 2 facteurs sur votre compte Google
2. Créez un "Mot de passe d'application" :
   - Allez sur https://myaccount.google.com/apppasswords
   - Générez un mot de passe pour "Mail"
   - Utilisez ce mot de passe (pas votre mot de passe Gmail normal)

### Option 2 : Autres services SMTP

```env
SMTP_HOST=smtp.votre-service.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_email@domaine.com
SMTP_PASS=votre_mot_de_passe
EMAIL_FROM="Numerologie App <votre_email@domaine.com>"
EMAIL_SERVICE=other
```

## 🔗 URL de base

Assurez-vous que `NEXT_PUBLIC_BASE_URL` est correctement configuré :

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

En production, remplacez par votre URL réelle :
```env
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
```

## ✅ Test

Une fois configuré, testez en :
1. Remplissant le formulaire avec un email
2. Vérifiant que vous recevez l'email avec le lien de connexion
3. Après l'analyse, vérifiant que vous recevez l'email avec le PDF

## ⚠️ Note

Si la configuration SMTP n'est pas complète, l'application continuera de fonctionner mais :
- Les emails ne seront pas envoyés
- Les analyses seront quand même générées et sauvegardées
- Un message d'erreur apparaîtra dans les logs
