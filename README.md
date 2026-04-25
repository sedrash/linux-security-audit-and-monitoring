# Linux Security Audit and Monitoring Dashboard

Dashboard React/Vite réalisé pour présenter un projet d'audit, de durcissement et de surveillance continue d'un serveur Linux hébergé dans une machine virtuelle.

Ce dépôt peut être partagé avec l'enseignant afin de montrer la démarche suivie, les outils utilisés, les actions de hardening appliquées et la synthèse avant / après.

## Objectif du projet

Le projet a pour objectif de réduire la surface d'attaque d'une VM Linux, d'améliorer sa configuration de sécurité et de mettre en place une supervision de base.

La démarche est structurée en quatre phases :

1. audit initial du serveur Linux
2. analyse avec des outils de sécurité
3. durcissement du système
4. surveillance continue après correction

## Ce que montre le dashboard

- score d'audit Lynis avant et après correction
- outils utilisés pendant l'audit
- ports ouverts détectés
- vulnérabilités ou faiblesses principales
- actions de durcissement appliquées
- comparaison avant / après
- preuves techniques et constats
- supervision live via Socket.IO
- synthèse finale pour la démonstration

## Outils utilisés

### Audit et analyse

- `Lynis` : audit de sécurité et score de hardening
- `Nmap` : cartographie des ports et services exposés
- `Nikto` : analyse du service web
- `Chkrootkit` : recherche d'indices de rootkits
- `Rkhunter` : vérification complémentaire d'intégrité
- `ClamAV` : détection antivirus
- `YARA` : détection par règles

### Durcissement

- activation et configuration de `UFW`
- durcissement de `SSH`
- installation et configuration de `Fail2Ban`
- renforcement de la politique de mots de passe
- désactivation des services inutiles
- durcissement des paramètres `sysctl`
- activation d'`AppArmor`
- réduction des permissions excessives

### Surveillance continue

- `Auditd` pour la traçabilité système
- `Fail2Ban` pour la protection active
- `rsyslog` pour les journaux système
- `Wazuh` si la supervision centralisée est utilisée

## Stack technique

- `React`
- `Vite`
- `socket.io-client`
- `lucide-react`

## Lancer le projet en local

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrir ensuite l'adresse affichée par Vite, généralement :

```text
http://localhost:5173
```

## Build production

```bash
npm run build
npm run preview
```

## Structure du projet

- `src/App.jsx` : données, sections et logique principale du dashboard
- `src/App.css` : mise en page et design
- `src/main.jsx` : point d'entrée React
- `package.json` : scripts et dépendances

## Données affichées

Les données du dashboard sont définies dans `src/App.jsx`.

Elles peuvent être adaptées selon les résultats réels obtenus sur la VM :

- score Lynis avant / après
- ports détectés par Nmap
- résultats Nikto
- outils de sécurité utilisés
- actions de durcissement appliquées
- événements remontés par la supervision live

## Note de confidentialité

Le dépôt ne doit pas contenir d'informations sensibles.

À ne pas publier :

- mots de passe
- clés SSH privées
- tokens ou secrets
- logs complets contenant des données personnelles
- informations sensibles sur une machine réelle

Les résultats affichés dans le dashboard doivent être nettoyés ou anonymisés avant publication.

## Dépôt GitHub

Lien du dépôt :

```text
https://github.com/sedrash/linux-security-audit-and-monitoring
```

Commandes utiles pour publier une mise à jour :

```bash
git add .
git commit -m "update dashboard documentation"
git push
```

## Résumé

Ce dashboard présente une vue claire et synthétique d'un projet de cybersécurité Linux : audit initial, analyse technique, durcissement, supervision et comparaison finale. Il est conçu pour servir de support de démonstration pendant une soutenance ou une évaluation.
