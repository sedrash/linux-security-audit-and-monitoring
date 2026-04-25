# Linux Security Audit and Monitoring Dashboard

Dashboard web réalisé avec React et Vite pour présenter un projet d'audit, de durcissement et de surveillance continue d'une machine virtuelle Linux.

## Démo en ligne

Le dashboard est consultable directement dans le navigateur, sans téléchargement :

```text
https://sedrash.github.io/linux-security-audit-and-monitoring/
```

## Objectif

Ce projet présente une démarche complète de sécurisation d'une VM Linux :

1. réaliser un audit initial du système
2. identifier les services exposés et les faiblesses principales
3. appliquer des actions de durcissement
4. mettre en place une surveillance continue
5. comparer l'état avant et après correction

Le dashboard sert de support de démonstration pour visualiser les résultats de manière claire pendant une soutenance ou une évaluation.

## Contenu du dashboard

- score Lynis avant / après
- outils utilisés pendant l'audit
- ports ouverts détectés
- vulnérabilités principales
- actions de durcissement appliquées
- preuves techniques et constats
- supervision live pendant la démonstration VM
- timeline des étapes de sécurisation
- tableau de comparaison avant / après

## Outils utilisés

### Audit et analyse

- `Lynis` : audit de sécurité et score de hardening
- `Nmap` : détection des ports et services exposés
- `Nikto` : analyse du service web
- `Chkrootkit` : recherche d'indices de rootkits
- `Rkhunter` : vérification complémentaire d'intégrité
- `ClamAV` : analyse antivirus
- `YARA` : détection par règles

### Durcissement du système

- activation du pare-feu `UFW`
- durcissement de la configuration `SSH`
- installation et configuration de `Fail2Ban`
- renforcement de la politique de mots de passe
- désactivation des services inutiles
- durcissement des paramètres `sysctl`
- activation d'`AppArmor`
- réduction des permissions excessives

### Surveillance continue

- `Auditd` pour la traçabilité système
- `Fail2Ban` pour bloquer les tentatives répétées
- `rsyslog` pour la gestion des journaux
- `Wazuh` pour la supervision centralisée si disponible

## Note sur la démo en ligne

La version publiée sur GitHub Pages affiche une synthèse des résultats et des données anonymisées.

La partie live dépend de la VM de démonstration utilisée pendant le projet. Elle n'est donc pas connectée depuis GitHub Pages, car l'adresse de la VM appartient à un réseau local de laboratoire.

## Stack technique

- `React`
- `Vite`
- `Socket.IO Client`
- `lucide-react`
- `GitHub Pages`
- `GitHub Actions`

## Lancer le projet en local

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrir ensuite l'adresse affichée par Vite :

```text
http://localhost:5173
```

## Build production

```bash
npm run build
npm run preview
```

## Structure du projet

- `src/App.jsx` : contenu du dashboard, données affichées et logique live
- `src/App.css` : design et mise en page
- `src/main.jsx` : point d'entrée React
- `public/` : icônes et fichiers publics
- `.github/workflows/deploy.yml` : déploiement automatique GitHub Pages
- `vite.config.js` : configuration Vite et chemin GitHub Pages

## Confidentialité

Le dépôt ne contient pas de secrets ni de données sensibles.

À ne pas publier dans le dépôt :

- mots de passe
- clés SSH privées
- tokens
- logs complets avec données personnelles
- informations sensibles sur une machine réelle

Les informations affichées dans le dashboard doivent rester anonymisées ou adaptées à un environnement de test.
