# 🌐 Configuration du Domaine Personnalisé

## 📋 Recommandations pour numerologique.com

### 1. Enregistrement du Domaine

#### Option 1 : Namecheap (Recommandé) ⭐
- **Prix** : ~12-15€/an pour .com
- **Avantages** :
  - Interface simple et moderne
  - Support client excellent
  - Pas de frais cachés
  - DNS gratuit inclus
  - Protection WHOIS gratuite (WhoisGuard)
- **Site** : https://www.namecheap.com/

#### Option 2 : OVH
- **Prix** : ~10-12€/an pour .com
- **Avantages** :
  - Entreprise française
  - Support en français
  - Prix compétitifs
- **Site** : https://www.ovh.com/

#### Option 3 : Google Domains (maintenant Squarespace Domains)
- **Prix** : ~12€/an pour .com
- **Avantages** :
  - Intégration facile avec Google services
  - Interface simple
- **Note** : A été racheté par Squarespace

#### Option 4 : Cloudflare Registrar
- **Prix** : Prix coûtant (~8-10€/an)
- **Avantages** :
  - Pas de marge, prix au coût
  - DNS gratuit et performant
  - Protection DDoS incluse
- **Site** : https://www.cloudflare.com/products/registrar/

### 💡 Ma Recommandation : **Namecheap** ou **Cloudflare Registrar**

**Namecheap** si vous voulez une interface simple et un support excellent.  
**Cloudflare Registrar** si vous voulez le meilleur prix et des performances DNS optimales.

---

## 🚀 Configuration avec Vercel (Hébergement Actuel)

### ✅ Bonne Nouvelle : Vercel est PARFAIT pour votre app !

**Vercel offre :**
- ✅ Hébergement gratuit pour projets Next.js
- ✅ SSL automatique (HTTPS)
- ✅ CDN global (rapidité mondiale)
- ✅ Déploiements automatiques depuis GitHub
- ✅ Bandwidth généreux (100 GB/mois sur plan gratuit)
- ✅ Pas besoin de serveur à gérer

### 📊 Plans Vercel

#### Plan Hobby (Gratuit) - Suffisant pour commencer
- **Bandwidth** : 100 GB/mois
- **Builds** : Illimités
- **Domaine personnalisé** : ✅ Inclus
- **SSL** : ✅ Automatique
- **Limite** : 1 projet

#### Plan Pro ($20/mois) - Recommandé pour production
- **Bandwidth** : 1 TB/mois
- **Builds** : Illimités
- **Domaines personnalisés** : Illimités
- **Analytics** : ✅ Inclus
- **Support** : Prioritaire
- **Projets** : Illimités

### 💾 Stockage des Données

**Votre application utilise déjà :**
- ✅ **Firebase Firestore** : Base de données (stockage des analyses, utilisateurs)
- ✅ **Vercel** : Hébergement de l'application (code Next.js)

**Pas besoin d'espace de stockage supplémentaire !**

Firebase Firestore offre :
- **Plan Spark (Gratuit)** :
  - 1 GB stockage
  - 50K lectures/jour
  - 20K écritures/jour
  - Suffisant pour ~1000-2000 analyses

- **Plan Blaze (Pay-as-you-go)** :
  - $0.18/GB stockage
  - $0.06/100K lectures
  - $0.18/100K écritures
  - Parfait pour croissance

---

## 🔧 Étapes de Configuration

### Étape 1 : Enregistrer le Domaine

1. Choisissez un registrar (Namecheap recommandé)
2. Recherchez "numerologique.com"
3. Ajoutez au panier et complétez l'achat
4. Configurez les informations WHOIS (protection incluse)

### Étape 2 : Configurer le Domaine dans Vercel

1. **Connectez-vous à Vercel** : https://vercel.com/dashboard
2. **Sélectionnez votre projet** : numerologique
3. **Allez dans Settings** → **Domains**
4. **Ajoutez le domaine** : `numerologique.com`
5. **Vercel vous donnera des enregistrements DNS** à configurer

### Étape 3 : Configurer les DNS

#### Option A : Utiliser les DNS de Vercel (Recommandé)

1. Dans votre registrar (ex: Namecheap), allez dans la gestion DNS
2. Changez les **Nameservers** vers ceux de Vercel :
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. Vercel gérera automatiquement tous les enregistrements

#### Option B : Configurer les DNS manuellement

Si vous gardez les DNS de votre registrar, ajoutez ces enregistrements :

**Type A** (si Vercel le demande) :
```
@ → 76.76.21.21
```

**Type CNAME** (recommandé) :
```
www → cname.vercel-dns.com
```

**Type AAAA** (IPv6) :
```
@ → 2606:4700:3034::ac43:92a2
```

### Étape 4 : Attendre la Propagation DNS

- ⏱️ **Délai** : 24-48 heures (généralement 1-2 heures)
- ✅ **Vérification** : Vercel vous notifiera quand c'est actif
- 🔒 **SSL** : Vercel génère automatiquement le certificat SSL

---

## 📝 Configuration Recommandée Complète

### Stack Technique (Actuelle - Parfaite !)

```
┌─────────────────────────────────────┐
│  numerologique.com                  │
│  (Domaine personnalisé)             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Vercel                             │
│  - Hébergement Next.js              │
│  - SSL automatique                  │
│  - CDN global                       │
│  - Déploiements auto                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Firebase Firestore                  │
│  - Base de données                  │
│  - Stockage analyses/utilisateurs   │
└─────────────────────────────────────┘
```

### Coûts Mensuels Estimés

**Démarrage (Gratuit) :**
- Domaine : 12€/an (~1€/mois)
- Vercel : Gratuit
- Firebase : Gratuit (plan Spark)
- **Total : ~1€/mois** 🎉

**Croissance (Payant) :**
- Domaine : 12€/an (~1€/mois)
- Vercel Pro : 20€/mois
- Firebase Blaze : ~5-10€/mois (selon usage)
- **Total : ~26-31€/mois**

---

## 🎯 Checklist de Configuration

- [ ] Enregistrer numerologique.com chez Namecheap ou Cloudflare
- [ ] Configurer la protection WHOIS (gratuite)
- [ ] Ajouter le domaine dans Vercel (Settings → Domains)
- [ ] Configurer les DNS (Nameservers Vercel recommandés)
- [ ] Attendre la propagation DNS (1-48h)
- [ ] Vérifier que HTTPS fonctionne automatiquement
- [ ] Tester l'accès via numerologique.com

---

## 🔒 Sécurité et Performance

### SSL/HTTPS
- ✅ **Automatique** avec Vercel
- ✅ Certificat Let's Encrypt renouvelé automatiquement
- ✅ Redirection HTTP → HTTPS automatique

### Performance
- ✅ **CDN Vercel** : Contenu servi depuis le serveur le plus proche
- ✅ **Edge Functions** : Code exécuté près des utilisateurs
- ✅ **Optimisations automatiques** : Images, CSS, JS optimisés

### Sécurité
- ✅ **Protection DDoS** : Incluse avec Vercel
- ✅ **Firewall** : Configurable dans Vercel
- ✅ **Variables d'environnement** : Sécurisées dans Vercel

---

## 📞 Support

- **Vercel Support** : https://vercel.com/support
- **Firebase Support** : https://firebase.google.com/support
- **Documentation Vercel Domains** : https://vercel.com/docs/concepts/projects/domains

---

## ✅ Recommandation Finale

1. **Enregistrer** : numerologique.com chez **Namecheap** (~12€/an)
2. **Hébergement** : Garder **Vercel** (déjà configuré, gratuit pour commencer)
3. **Base de données** : Garder **Firebase Firestore** (déjà configuré, gratuit pour commencer)
4. **DNS** : Utiliser les **Nameservers Vercel** (plus simple)

**Pas besoin de changer d'hébergement ! Vercel + Firebase = Solution parfaite pour votre app Next.js.** 🚀
