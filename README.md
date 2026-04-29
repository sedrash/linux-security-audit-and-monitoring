# Linux Security Audit and Monitoring Dashboard

Reproducible lab for auditing and monitoring an intentionally vulnerable Linux VM.

The project has three parts:

- a Vagrant Ubuntu VM with SSH, Apache, weak lab configs, logs, and audit tools
- a Node.js backend that connects to the VM over SSH, runs real scans, parses results, and emits Socket.IO updates
- a React/Vite frontend that calls the API and shows live audit progress

## Security Warning

This repository provisions a deliberately weak Linux machine for local training. Use it only in an isolated lab network. Do not expose the Vagrant VM to the internet or reuse the sample credentials on any real system.

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

Backend API:

```text
http://localhost:3001/api/audit
http://localhost:3001/api/audit/run
```

Forwarded lab services:

```text
SSH from host: ssh vagrant@127.0.0.1 -p 2222
Web from host: http://localhost:8081
VM private IP: 192.168.56.101
```

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
