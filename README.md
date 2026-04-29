# Linux Security Audit and Monitoring Dashboard

Reproducible lab for auditing and monitoring an intentionally vulnerable Linux VM.

The project has three parts:

- a Vagrant Ubuntu VM with SSH, Apache, weak lab configs, logs, and audit tools
- a Node.js backend that connects to the VM over SSH, runs real scans, parses results, and emits Socket.IO updates
- a React/Vite frontend that calls the API and shows live audit progress

## Security Warning

<<<<<<< HEAD
This repository provisions a deliberately weak Linux machine for local training. Use it only in an isolated lab network. Do not expose the Vagrant VM to the internet or reuse the sample credentials on any real system.
=======
Note : ce dashboard a été réalisé en complément du rapport. Il permet de visualiser rapidement la démarche d'audit, les outils utilisés, les actions de durcissement et la synthèse avant / après, si vous souhaitez consulter une version interactive du travail.

## Objectif
>>>>>>> 349b834 (new update)

## Requirements

- Vagrant
- VirtualBox
- Docker and Docker Compose
- Node.js, only if you want to run the frontend outside Docker

## Quick Start

Start the vulnerable VM:

```bash
vagrant up
```

Start the frontend and backend containers:

```bash
docker compose up --build
```

Open the dashboard:

```text
http://localhost:5173
```

<<<<<<< HEAD
Backend API:
=======
## Lancer la version reproductible avec VM + Docker

Cette version démarre une VM Linux vulnérable avec Vagrant, puis lance le frontend et le backend dans Docker. La VM n'est pas containerisée.

### Prérequis

- `VirtualBox`
- `Vagrant`
- `Docker` et `docker compose`

### 1. Créer la VM vulnérable

```bash
vagrant up
```

La VM utilise par défaut :

```text
IP avec libvirt: voir `vagrant ssh-config`
IP avec VirtualBox: 192.168.56.101
SSH: auditlab / password123
Web: http://IP_DE_LA_VM
```

Elle installe notamment `Lynis`, `Nmap`, `Nikto`, `Chkrootkit`, `Rkhunter`, `ClamAV`, `YARA`, `Fail2Ban`, `Auditd`, `Apache` et `OpenSSH`. Certaines configurations sont volontairement faibles pour rendre l'audit démontrable.

### 2. Vérifier la configuration d'environnement

Le fichier `.env` local sert à connecter le backend à la VM :

```text
VM_HOST=IP_DE_LA_VM
VM_SSH_HOST=IP_DE_LA_VM
VM_SSH_PORT=22
VM_SSH_USER=auditlab
VM_SSH_PASSWORD=password123
BACKEND_PORT=3001
VITE_BACKEND_URL=http://localhost:3001
FRONTEND_PORT=8080
```

Un modèle versionné est disponible dans `.env.example`.

`VM_HOST` est la cible auditée. `VM_SSH_HOST` est l'adresse utilisée par le backend pour se connecter en SSH à la VM. Avec `libvirt`, récupérez l'IP réelle avec `vagrant ssh-config`, ligne `HostName`, puis copiez-la dans `.env`. Avec `VirtualBox`, vous pouvez aussi utiliser le port forwardé `host.docker.internal:2222`.

### 3. Lancer frontend + backend

```bash
docker compose up --build
```

URLs utiles :

```text
Frontend: http://localhost:8080
Backend health: http://localhost:3001/api/health
Dernier audit: http://localhost:3001/api/audit
Lancer un audit: POST http://localhost:3001/api/audit/run
VM web: http://192.168.56.101
```

Sur Linux avec `libvirt`, le backend Docker utilise le réseau hôte (`network_mode: host`) pour joindre directement l'IP de la VM. C'est normal que le service backend n'affiche pas de mapping de port dans `docker compose ps`; il écoute directement sur `localhost:3001`.

Dans le dashboard, cliquer sur `Run Audit`. Le backend se connecte à la VM via SSH, lance les scans réels, parse une synthèse, puis pousse les mises à jour en temps réel via Socket.IO.

### 4. Tester l'API sans le frontend

```bash
curl http://localhost:3001/api/health
curl -X POST http://localhost:3001/api/audit/run
curl http://localhost:3001/api/audit
```

### 5. Générer des échecs SSH pour la partie live

Optionnel : installer `sshpass` sur la machine hôte, puis lancer :

```bash
VM_HOST=192.168.56.101 VM_PORT=22 ATTEMPTS=5 ./scripts/simulate-ssh-failures.sh
```

Relancer ensuite `Run Audit` pour voir les compteurs Fail2Ban et les événements SSH remonter dans le dashboard.

## Avertissement sécurité

Cette VM est volontairement vulnérable : mots de passe faibles, SSH permissif, serveur web exposant des informations, pare-feu permissif. À utiliser uniquement en laboratoire local. Ne pas exposer cette VM sur Internet ou sur un réseau non maîtrisé.

## Build production
>>>>>>> 349b834 (new update)

```text
http://localhost:3001/api/audit
http://localhost:3001/api/audit/run
```

Forwarded lab services:

<<<<<<< HEAD
```text
SSH from host: ssh vagrant@127.0.0.1 -p 2222
Web from host: http://localhost:8081
VM private IP: 192.168.56.101
```
=======
- `src/App.jsx` : contenu du dashboard, données affichées et logique live
- `src/App.css` : design et mise en page
- `src/main.jsx` : point d'entrée React
- `backend/` : API Express, Socket.IO et moteur d'audit SSH
- `Vagrantfile` : définition de la VM Linux vulnérable
- `scripts/provision-vm.sh` : provisioning des outils et mauvaises configurations contrôlées
- `scripts/simulate-ssh-failures.sh` : génération optionnelle d'échecs SSH
- `docker-compose.yml` : orchestration frontend + backend
- `public/` : icônes et fichiers publics
- `.github/workflows/deploy.yml` : déploiement automatique GitHub Pages
- `vite.config.js` : configuration Vite et chemin GitHub Pages
>>>>>>> 349b834 (new update)

## Environment

The repository includes `.env` with lab defaults:

```dotenv
VM_HOST=192.168.56.101
VM_SSH_PORT=22
VM_SSH_USER=vagrant
VM_SSH_PASSWORD=vagrant
VM_WEB_URL=http://192.168.56.101
BACKEND_PORT=3001
VITE_BACKEND_URL=http://localhost:3001
```

Copy `.env.example` if you want to reset or customize the configuration.

## Run an Audit

Use the dashboard button, or call the API directly:

```bash
curl -X POST http://localhost:3001/api/audit/run
```

The backend connects to the VM over SSH and runs commands such as:

- `lynis audit system --quick --no-colors`
- `nmap -sV -Pn localhost`
- `nikto -host http://localhost`
- `ufw status verbose`
- `fail2ban-client status sshd`
- auth-log sampling for failed SSH attempts
- YARA sample rule execution

The frontend receives:

- initial data from `GET /api/audit`
- audit trigger status from `POST /api/audit/run`
- live progress from Socket.IO events
- final dashboard data from Socket.IO `dashboard-update`

## Simulate SSH Failures

On a Linux/macOS host with `sshpass` installed:

```bash
VM_HOST=192.168.56.101 VM_SSH_PORT=22 ATTEMPTS=8 ./scripts/simulate-ssh-failures.sh
```

From Windows, you can manually attempt bad SSH logins:

```powershell
ssh attacker@127.0.0.1 -p 2222
```

Then run a new audit and check the live SSH failure count and Fail2Ban status.

## Local Frontend Development

Install dependencies:

```bash
npm install
```

Run Vite:

```bash
npm run dev
```

For the backend outside Docker:

```bash
cd backend
npm install
npm run dev
```

## Project Structure

- `Vagrantfile` provisions the lab VM
- `scripts/provision-vulnerable-vm.sh` installs tools and weak lab configs
- `scripts/simulate-ssh-failures.sh` generates failed SSH auth events
- `backend/src/auditEngine.js` runs scans over SSH and parses results
- `backend/src/index.js` exposes REST and Socket.IO
- `src/App.jsx` renders API-driven audit data
- `docker-compose.yml` runs frontend and backend containers

## Cleanup

Stop the app:

```bash
docker compose down
```

Destroy the lab VM:

```bash
vagrant destroy -f
```
