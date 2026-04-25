# Linux Security Audit and Monitoring Dashboard

Dashboard React/Vite pour présenter un projet d'audit, de durcissement et de surveillance continue d'un serveur Linux dans une machine virtuelle.

Le projet met en avant :
- l'état initial du système
- les outils utilisés pendant l'audit
- les actions de durcissement appliquées
- la phase de surveillance continue
- une synthèse avant / après

## Aperçu

Cette interface a été pensée pour une démonstration de projet académique ou technique autour de la cybersécurité Linux.  
Elle centralise les résultats d'audit, les mesures de hardening et les mécanismes de monitoring dans un dashboard unique, lisible et prêt à être présenté sur GitHub.

## Fonctionnalités

- score d'audit avant et après correction
- liste des outils utilisés pendant l'analyse
- phase de durcissement du système
- phase de surveillance continue
- ports ouverts détectés
- services et contrôles de sécurité suivis
- preuves techniques et constats
- table de comparaison avant / après
- supervision live via Socket.IO

## Outils représentés dans le dashboard

### Audit et analyse

- `Lynis`
- `Nmap`
- `Nikto`
- `Chkrootkit`
- `Rkhunter`
- `ClamAV`
- `YARA`

### Durcissement

- `UFW`
- `SSH hardening`
- `Fail2Ban`
- renforcement des mots de passe
- désactivation des services inutiles
- durcissement `sysctl`
- `AppArmor`
- réduction des permissions excessives

### Surveillance continue

- `Auditd`
- `Fail2Ban`
- `rsyslog`
- `Wazuh` si installé

## Stack technique

- `React`
- `Vite`
- `socket.io-client`
- `lucide-react`

## Lancer le projet en local

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse affichée par Vite, généralement :

```text
http://localhost:5173
```

## Build production

```bash
npm run build
npm run preview
```

## Structure utile

- `src/App.jsx` : données et structure principale du dashboard
- `src/App.css` : style et mise en page
- `package.json` : scripts et dépendances

## Personnalisation

Les données affichées sont actuellement définies dans `src/App.jsx`.  
Tu peux facilement adapter :

- les scores d'audit
- les outils utilisés
- les actions de durcissement
- les outils de monitoring
- les ports ouverts
- les événements temps réel

## Dépôt GitHub

Repo : `https://github.com/sedrash/linux-security-audit-and-monitoring`

Pour publier des modifications après mise à jour :

```bash
git add .
git commit -m "update dashboard"
git push
```

## Idée du projet

Ce dépôt présente une démarche complète en 4 temps :

1. audit initial du serveur Linux
2. analyse avec des outils de sécurité
3. durcissement du système
4. mise en place d'une surveillance continue

L'objectif est de réduire la surface d'attaque, améliorer la résistance du système et mieux détecter les incidents.
