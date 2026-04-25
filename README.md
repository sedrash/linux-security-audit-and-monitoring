# Dashboard Audit Linux

Dashboard React/Vite pour présenter un audit de sécurité d'un serveur Linux dans une VM, avec synthèse avant/après durcissement et supervision en temps réel.

## Contenu

- score d'audit avant et après correction
- outils utilisés pendant l'audit
- ports ouverts et services surveillés
- vulnérabilités principales
- timeline de durcissement
- supervision live via Socket.IO

## Stack

- React
- Vite
- Socket.IO client
- Lucide React

## Lancer le projet

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Personnalisation

Les données du dashboard sont actuellement définies dans [src/App.jsx](/home/sedra/Documents/ProjetMajeur/dashboard-audit/src/App.jsx). Tu peux y remplacer :

- la liste des outils réellement utilisés dans ta VM
- les ports et services exacts
- les vulnérabilités relevées dans ton rapport
- les événements live envoyés par ton backend Socket.IO

## Publication GitHub

Étapes conseillées :

```bash
git init
git add .
git commit -m "feat: complete audit security dashboard"
git branch -M main
git remote add origin <url-de-ton-repo>
git push -u origin main
```

## Remarque

Le fichier fourni `pratique_Audit(1).pdf` n'était pas un vrai rapport exploitable mais un fichier XML d'erreur. Le dashboard a donc été enrichi à partir du contenu déjà présent dans le projet et des outils d'audit Linux les plus cohérents avec ta maquette actuelle.
