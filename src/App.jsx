import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import {
  Activity,
  Ban,
  FileSearch,
  Globe,
  Lock,
  Play,
  Radar,
  RefreshCw,
  ScanSearch,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TerminalSquare,
  Wrench,
} from "lucide-react";

<<<<<<< HEAD
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const fallbackData = {
  scoreBefore: 0,
  scoreAfter: 0,
  ufw: "Inconnu",
  fail2ban: "Inconnu",
  auditCoverage: "En attente",
  compliance: "Non evalue",
  ports: [],
  tools: [],
  services: [],
  vulnerabilities: [],
  evidence: ["Cliquez sur Run Audit pour lancer les scans reels sur la VM."],
  live: {
    serverIp: "Configure par .env",
    sshPort: "22",
    attackStatus: "Pret",
=======
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

const canUseBackend = ["localhost", "127.0.0.1", "192.168.56.101"].includes(
  window.location.hostname,
);

const iconByName = {
  Lynis: Shield,
  Nmap: Radar,
  Nikto: Globe,
  Chkrootkit: ScanSearch,
  Rkhunter: FileSearch,
  ClamAV: ShieldCheck,
  YARA: ShieldAlert,
  "Activation du pare-feu UFW": BrickWallShield,
  "Durcissement de SSH": Lock,
  "Installation de Fail2Ban": Ban,
  "Renforcement des mots de passe": Shield,
  "Désactivation des services inutiles": Activity,
  "Durcissement des paramètres sysctl": ShieldCheck,
  "Activation d’AppArmor": ShieldAlert,
  "Réduction des permissions excessives": FileSearch,
  Auditd: FileSearch,
  Fail2Ban: Ban,
  rsyslog: Activity,
  Wazuh: Server,
};

const initialData = {
  scoreBefore: 60,
  scoreAfter: 70,
  ufw: "Actif",
  fail2ban: "Protection SSH active",
  auditCoverage: "Complet",
  compliance: "Durcissement validé",
  ports: ["22/tcp", "25/tcp", "80/tcp", "2222/tcp"],
  tools: [
    {
      name: "Lynis",
      category: "Audit",
      description: "Évaluation du hardening et scoring sécurité du serveur.",
      impact: "Base de référence avant / après correction",
      icon: Shield,
    },
    {
      name: "Nmap",
      category: "Reconnaissance",
      description: "Cartographie des ports ouverts et des services exposés.",
      impact: "Identification des faiblesses techniques du système",
      icon: Radar,
    },
    {
      name: "Nikto",
      category: "Web",
      description: "Analyse de sécurité du service web et des mauvaises configurations.",
      impact: "Repérage des risques applicatifs et HTTP",
      icon: Globe,
    },
    {
      name: "Chkrootkit",
      category: "Rootkits",
      description: "Recherche de rootkits, backdoors et anomalies locales.",
      impact: "Contrôle rapide de l’intégrité du système",
      icon: ScanSearch,
    },
    {
      name: "Rkhunter",
      category: "Rootkits",
      description: "Détection approfondie d’indices de rootkits et de fichiers suspects.",
      impact: "Vérification complémentaire de l’intégrité système",
      icon: FileSearch,
    },
    {
      name: "ClamAV",
      category: "Antimalware",
      description: "Détection de malwares, scripts suspects et fichiers infectés.",
      impact: "Contrôle antivirus complémentaire sur la VM",
      icon: ShieldCheck,
    },
    {
      name: "YARA",
      category: "Détection",
      description: "Recherche de patterns malveillants et règles de détection.",
      impact: "Identification d’artefacts suspects sur le système",
      icon: ShieldAlert,
    },
  ],
  hardeningSteps: [
    {
      title: "État initial",
      detail: "Audit de référence sur la VM avec repérage des services exposés.",
      status: "Initial",
    },
    {
      title: "Cartographie réseau",
      detail: "Analyse des ports et services visibles avec Nmap.",
      status: "Cartographié",
    },
    {
      title: "Audit web",
      detail: "Évaluation du serveur web avec Nikto pour détecter les mauvaises pratiques.",
      status: "Inspecté",
    },
    {
      title: "Contrôle d’intégrité",
      detail: "Vérification avec Chkrootkit et Rkhunter pour repérer les traces de compromission.",
      status: "Analysé",
    },
    {
      title: "Détection locale",
      detail: "Contrôle avec ClamAV et YARA pour rechercher malwares et artefacts suspects.",
      status: "Renforcé",
    },
    {
      title: "Validation finale",
      detail: "Nouvel audit Lynis pour confirmer les améliorations après analyse.",
      status: "Validé",
    },
  ],
  hardeningActions: [
    {
      name: "Activation du pare-feu UFW",
      category: "Filtrage",
      description: "Activation du pare-feu hôte pour limiter les flux réseau autorisés.",
      impact: "Réduction de l’exposition réseau",
      icon: BrickWallShield,
    },
    {
      name: "Durcissement de SSH",
      category: "Accès",
      description: "Renforcement de la configuration SSH pour mieux protéger l’accès distant.",
      impact: "Diminution du risque d’accès non autorisé",
      icon: Lock,
    },
    {
      name: "Installation de Fail2Ban",
      category: "Protection",
      description: "Blocage automatique des IP après des tentatives répétées d’authentification.",
      impact: "Protection contre le brute force",
      icon: Ban,
    },
    {
      name: "Renforcement des mots de passe",
      category: "Authentification",
      description: "Application d’exigences plus fortes sur la qualité des mots de passe.",
      impact: "Comptes mieux protégés",
      icon: Shield,
    },
    {
      name: "Désactivation des services inutiles",
      category: "Surface d’attaque",
      description: "Suppression ou arrêt des services non nécessaires au fonctionnement.",
      impact: "Réduction des points d’entrée potentiels",
      icon: Activity,
    },
    {
      name: "Durcissement des paramètres sysctl",
      category: "Noyau",
      description: "Renforcement des paramètres réseau et système au niveau noyau.",
      impact: "Comportement système plus résistant",
      icon: ShieldCheck,
    },
    {
      name: "Activation d’AppArmor",
      category: "Confinement",
      description: "Mise en place de profils de confinement pour limiter les actions des applications.",
      impact: "Impact réduit en cas de compromission",
      icon: ShieldAlert,
    },
    {
      name: "Réduction des permissions excessives",
      category: "Permissions",
      description: "Restriction des droits trop larges sur les fichiers et répertoires sensibles.",
      impact: "Moins de privilèges inutiles",
      icon: FileSearch,
    },
  ],
  hardeningGoals: [
    "Réduire la surface d’attaque du système.",
    "Améliorer la résistance globale face aux tentatives d’intrusion.",
    "Renforcer les mécanismes de contrôle, d’accès et de confinement.",
  ],
  services: [
    {
      name: "Nmap",
      state: "Cartographié",
      note: "Ports et services exposés identifiés depuis la VM.",
    },
    {
      name: "Nikto",
      state: "Inspecté",
      note: "Service web vérifié pour détecter les mauvaises configurations.",
    },
    {
      name: "Chkrootkit",
      state: "Analysé",
      note: "Recherche locale d’indices de rootkits et backdoors.",
    },
    {
      name: "Rkhunter",
      state: "Vérifié",
      note: "Contrôle complémentaire de l’intégrité système.",
    },
    {
      name: "ClamAV",
      state: "Scan",
      note: "Détection de malwares et de fichiers suspects.",
    },
    {
      name: "YARA",
      state: "Analyse",
      note: "Détection avancée par règles sur les artefacts suspects.",
    },
  ],
  evidence: [
    "Amélioration du score Lynis après hardening.",
    "Nmap a permis d’identifier les ports ouverts et les services exposés.",
    "Nikto a servi à contrôler les faiblesses et expositions du service web.",
    "Chkrootkit et Rkhunter ont vérifié l’absence d’indices de rootkits.",
    "ClamAV a apporté une détection antivirus complémentaire.",
    "YARA complète la détection avec des règles ciblées sur les menaces.",
  ],
  continuousMonitoring: [
    {
      name: "Auditd",
      role: "Journalisation",
      description: "Trace les actions sensibles et les événements de sécurité sur la VM.",
      outcome: "Meilleure traçabilité système",
      icon: FileSearch,
    },
    {
      name: "Fail2Ban",
      role: "Protection active",
      description: "Détecte les tentatives répétées et bannit automatiquement les IP suspectes.",
      outcome: "Réduction du risque de brute force",
      icon: Ban,
    },
    {
      name: "rsyslog",
      role: "Centralisation",
      description: "Agrège et redirige les journaux pour faciliter l’analyse continue.",
      outcome: "Logs mieux structurés et exploitables",
      icon: Activity,
    },
    {
      name: "Wazuh",
      role: "SIEM",
      description: "Supervision centralisée, corrélation et remontée d’alertes de sécurité si installé.",
      outcome: "Détection plus rapide des incidents",
      icon: Server,
    },
  ],
  monitoringGoals: [
    "Détecter rapidement les comportements suspects ou tentatives d’intrusion.",
    "Assurer une meilleure traçabilité des événements de sécurité.",
    "Centraliser l’observation continue après les corrections appliquées.",
  ],
  vulnerabilities: [
    {
      name: "SSH",
      severity: "Critique",
      before: "Configuration permissive",
      after: "SSH durci",
    },
    {
      name: "UFW",
      severity: "Haute",
      before: "Configuration insuffisante",
      after: "Pare-feu actif",
    },
    {
      name: "Fail2Ban",
      severity: "Haute",
      before: "Absent",
      after: "Installé et actif",
    },
    {
      name: "Apache",
      severity: "Moyenne",
      before: "Informations exposées",
      after: "Configuration renforcée",
    },
  ],
  live: {
    serverIp: "192.168.56.101",
    sshPort: "2222",
    attackStatus: "Backend non connecté",
>>>>>>> 349b834 (new update)
    failedAttempts: 0,
    bannedIps: [],
    lastEvent: "Aucun audit lance",
    events: [],
  },
};

<<<<<<< HEAD
const iconMap = {
  Lynis: Shield,
  Nmap: Radar,
  Nikto: Globe,
  Chkrootkit: ScanSearch,
  Rkhunter: FileSearch,
  ClamAV: ShieldCheck,
  YARA: ShieldAlert,
  SSH: Lock,
  Fail2Ban: Ban,
  Apache: Server,
  UFW: Shield,
};

function SeverityBadge({ level = "Moyenne" }) {
=======
function withKnownIcons(items = []) {
  return items.map((item) => ({
    ...item,
    icon: item.icon || iconByName[item.name] || Shield,
  }));
}

function normalizeAuditData(payload) {
  const next = payload?.data || payload || {};

  return {
    ...next,
    tools: withKnownIcons(next.tools || initialData.tools),
    hardeningActions: withKnownIcons(
      next.hardeningActions || initialData.hardeningActions,
    ),
    continuousMonitoring: withKnownIcons(
      next.continuousMonitoring || initialData.continuousMonitoring,
    ),
    hardeningSteps: next.hardeningSteps || initialData.hardeningSteps,
    hardeningGoals: next.hardeningGoals || initialData.hardeningGoals,
    monitoringGoals: next.monitoringGoals || initialData.monitoringGoals,
    live: {
      ...initialData.live,
      ...(next.live || {}),
    },
  };
}

function auditIsActive(payload, data) {
  return Boolean(payload?.running) && data?.live?.attackStatus !== "Erreur";
}

function SeverityBadge({ level }) {
>>>>>>> 349b834 (new update)
  const cls =
    level === "Critique"
      ? "severity critical"
      : level === "Haute"
        ? "severity high"
        : "severity medium";

  return <span className={cls}>{level}</span>;
}

function LiveEventBadge({ level = "info" }) {
  return (
    <span
      className={`live-badge ${
        level === "critical"
          ? "live-critical"
          : level === "warning"
            ? "live-warning"
            : "live-info"
      }`}
    >
      {level}
    </span>
  );
}

function ToolCard({ tool }) {
  const Icon = iconMap[tool.name] || Wrench;

  return (
    <div className="tool-card">
      <div className="tool-card-top">
        <div className="tool-icon">
          <Icon size={20} />
        </div>
        <span className="tool-category">{tool.category}</span>
      </div>
      <h3>{tool.name}</h3>
      <p>{tool.description}</p>
      <strong>{tool.impact}</strong>
    </div>
  );
}

export default function App() {
<<<<<<< HEAD
  const [data, setData] = useState(fallbackData);
  const [running, setRunning] = useState(false);
  const [connection, setConnection] = useState("Hors ligne");
  const [error, setError] = useState("");

  const scoreDelta = useMemo(
    () => (Number(data.scoreAfter) || 0) - (Number(data.scoreBefore) || 0),
    [data.scoreAfter, data.scoreBefore],
  );

  useEffect(() => {
    async function loadAudit() {
      try {
        const response = await fetch(`${API_BASE}/api/audit`);
        if (!response.ok) throw new Error(`API ${response.status}`);
        const payload = await response.json();
        setData((prev) => ({ ...prev, ...payload, live: { ...prev.live, ...payload.live } }));
        setRunning(Boolean(payload.running));
        setError("");
      } catch (err) {
        setConnection("API indisponible");
        setError(`Impossible de charger l'audit: ${err.message}`);
      }
    }

    loadAudit();

    const socket = io(API_BASE, {
=======
  const [data, setData] = useState(initialData);
  const [isRunning, setIsRunning] = useState(false);
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    if (!canUseBackend) {
      return undefined;
    }

    fetch(`${BACKEND_URL}/api/audit`)
      .then((response) => response.json())
      .then((payload) => {
        const normalized = normalizeAuditData(payload);
        setIsRunning(auditIsActive(payload, normalized));
        setData((prev) => ({
          ...prev,
          ...normalized,
        }));
      })
      .catch(() => {
        setBackendError("Backend indisponible");
      });

    const socket = io(BACKEND_URL, {
>>>>>>> 349b834 (new update)
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

<<<<<<< HEAD
    socket.on("connect", () => setConnection("Connecte"));
    socket.on("disconnect", () => setConnection("Hors ligne"));
    socket.on("connect_error", () => setConnection("Socket indisponible"));
    socket.on("audit:status", (payload) => setRunning(Boolean(payload.running)));
    socket.on("audit:progress", (event) => {
      setData((prev) => ({
        ...prev,
        live: {
          ...prev.live,
          attackStatus: "Audit en cours",
          lastEvent: event.message,
          events: [event, ...(prev.live.events || [])].slice(0, 20),
        },
=======
    socket.on("audit:update", (payload) => {
      setBackendError(payload.error || "");
      const normalized = normalizeAuditData(payload);
      setIsRunning(auditIsActive(payload, normalized));
      setData((prev) => ({
        ...prev,
        ...normalized,
      }));
    });

    socket.on("dashboard-update", (payload) => {
      const normalized = normalizeAuditData(payload);
      if (normalized.live.attackStatus === "Erreur") {
        setIsRunning(false);
      }
      setData((prev) => ({
        ...prev,
        ...normalized,
>>>>>>> 349b834 (new update)
      }));
    });
    socket.on("dashboard-update", (payload) => {
      setData((prev) => ({ ...prev, ...payload, live: { ...prev.live, ...payload.live } }));
      setRunning(Boolean(payload.running));
      setError("");
    });

    return () => socket.disconnect();
  }, []);

<<<<<<< HEAD
  async function runAudit() {
    setError("");
    setRunning(true);
    try {
      const response = await fetch(`${API_BASE}/api/audit/run`, { method: "POST" });
      if (!response.ok && response.status !== 409) {
        throw new Error(`API ${response.status}`);
      }
    } catch (err) {
      setRunning(false);
      setError(`Impossible de lancer l'audit: ${err.message}`);
    }
  }
=======
  const runAudit = async () => {
    setBackendError("");
    setIsRunning(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/audit/run`, {
        method: "POST",
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok && response.status !== 409) {
        throw new Error(payload.message || "Impossible de lancer l'audit");
      }
    } catch (error) {
      setBackendError(error.message);
      setIsRunning(false);
    }
  };
>>>>>>> 349b834 (new update)

  return (
    <div className="dashboard">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="chip">Lab Linux . Audit reel . VM Vagrant</div>
          <h1>Dashboard d'audit et de monitoring securite</h1>
          <p>
            Les cartes sont alimentees par l'API backend, qui se connecte a la VM
            en SSH, execute les scans et diffuse les mises a jour en direct.
          </p>
          <div className="hero-actions">
            <button className="run-button" type="button" onClick={runAudit} disabled={running}>
              <Play size={18} />
              {running ? "Audit en cours" : "Run Audit"}
            </button>
            <span className="connection-pill">{connection}</span>
          </div>
          {error ? <p className="error-line">{error}</p> : null}
        </div>

        <div className="hero-side">
          <div className="hero-metric-card">
            <span>Progression du hardening</span>
            <strong>
              {scoreDelta >= 0 ? "+" : ""}
              {scoreDelta} <small>pts Lynis</small>
            </strong>
          </div>
          <div className="audit-control">
            <button className="audit-button" onClick={runAudit} disabled={isRunning || !canUseBackend}>
              {isRunning ? <RefreshCw size={18} /> : <Play size={18} />}
              <span>{isRunning ? "Audit en cours" : "Run Audit"}</span>
            </button>
            <p>
              {backendError ||
                (canUseBackend
                  ? `API: ${BACKEND_URL}`
                  : "Live désactivé hors environnement local")}
            </p>
          </div>
          <div className="hero-mini-grid">
            <div className="hero-mini-card">
              <Shield size={18} />
              <div>
                <span>Couverture audit</span>
                <strong>{data.auditCoverage}</strong>
              </div>
            </div>
            <div className="hero-mini-card">
              <Activity size={18} />
              <div>
                <span>Supervision</span>
                <strong>{data.live.attackStatus}</strong>
              </div>
            </div>
            <div className="hero-mini-card">
              <Server size={18} />
              <div>
                <span>Serveur</span>
                <strong>{data.live.serverIp}</strong>
              </div>
            </div>
            <div className="hero-mini-card">
              <ShieldAlert size={18} />
              <div>
                <span>Conformite</span>
                <strong>{data.compliance}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card danger">
          <h3>Score Lynis initial</h3>
          <div className="big-number red-text">{data.scoreBefore}</div>
          <p>Score detecte par le dernier audit systeme.</p>
        </div>
        <div className="stat-card success">
          <h3>Score courant</h3>
          <div className="big-number green-text">{data.scoreAfter}</div>
          <p>Etat observe sur la VM au dernier scan.</p>
        </div>
        <div className="stat-card info">
          <h3>UFW</h3>
          <div className="big-status cyan-text">{data.ufw}</div>
          <p>Statut du filtrage reseau cote VM.</p>
        </div>
        <div className="stat-card accent">
          <h3>Fail2Ban</h3>
          <div className="big-status purple-text">{data.fail2ban}</div>
          <p>Protection active contre les echecs SSH repetes.</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Outils executes</h2>
          <span className="panel-pill">Backend SSH</span>
        </div>
        <div className="tools-grid">
          {(data.tools || []).map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      <section className="triple-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Ports ouverts</h2>
            <span className="panel-pill">Nmap / ss</span>
          </div>
          <div className="ports-grid">
            {(data.ports || []).length ? (
              data.ports.map((port) => (
                <div key={port} className="port-card">
                  {port}
                </div>
              ))
            ) : (
              <div className="live-event-card">Aucun port charge.</div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Services suivis</h2>
            <span className="panel-pill">Systemd</span>
          </div>
          <div className="services-list">
            {(data.services || []).map((service) => (
              <div key={service.name} className="service-card">
                <div className="service-top">
                  <h3>{service.name}</h3>
                  <span className="service-state">{service.state}</span>
                </div>
                <p>{service.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Preuves techniques</h2>
            <span className="panel-pill">Constats</span>
          </div>
          <div className="evidence-list">
            {(data.evidence || []).map((item) => (
              <div key={item} className="evidence-item">
                <Wrench size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dual-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Vulnerabilites principales</h2>
            <span className="panel-pill">Audit courant</span>
          </div>
          <div className="vuln-grid">
            {(data.vulnerabilities || []).map((item) => (
              <div key={item.name} className="vuln-card">
                <div className="vuln-top">
                  <h3>{item.name}</h3>
                  <SeverityBadge level={item.severity} />
                </div>
                <div className="vuln-block">
                  <p className="label before-label">Constat</p>
                  <p className="value">{item.before}</p>
                </div>
                <div className="vuln-block">
                  <p className="label after-label">Correction attendue</p>
                  <p className="value">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel live-panel">
          <div className="panel-header">
            <h2>Supervision live</h2>
            <span className="panel-pill live-pill">Socket.IO</span>
          </div>
          <div className="live-top-cards">
            <div className="live-mini-card">
              <span>IP serveur</span>
              <strong>{data.live.serverIp}</strong>
            </div>
            <div className="live-mini-card">
              <span>Port SSH</span>
              <strong>{data.live.sshPort}</strong>
            </div>
            <div className="live-mini-card">
              <span>Statut</span>
              <strong>{running ? "Audit en cours" : data.live.attackStatus}</strong>
            </div>
            <div className="live-mini-card">
              <span>Echecs SSH</span>
              <strong>{data.live.failedAttempts}</strong>
            </div>
          </div>

          <div className="live-section">
            <div className="live-box">
              <h3>Dernier evenement</h3>
              <p>{data.live.lastEvent}</p>
            </div>
            <div className="live-box">
              <h3>IP bannies</h3>
              <div className="banned-list">
                {(data.live.bannedIps || []).length ? (
                  data.live.bannedIps.map((ip) => (
                    <span key={ip} className="banned-ip">
                      {ip}
                    </span>
                  ))
                ) : (
                  <span className="banned-ip">Aucune IP bannie</span>
                )}
              </div>
            </div>
          </div>

          <div className="live-events">
            <h3>Flux d'evenements</h3>
            {(data.live.events || []).length ? (
              data.live.events.map((event, index) => (
                <div key={`${event.time}-${index}`} className="live-event-card">
                  <div className="live-event-top">
                    <span className="event-time">
                      {event.time} . {event.type}
                    </span>
                    <LiveEventBadge level={event.level} />
                  </div>
                  <p>{event.message}</p>
                </div>
              ))
            ) : (
              <div className="live-event-card">
                <p>Aucun evenement live pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="footer-note">
        <TerminalSquare size={18} />
        <p>
          Environnement de laboratoire uniquement. La VM Vagrant est volontairement
          vulnerable pour produire des resultats reproductibles.
        </p>
      </section>
    </div>
  );
}
