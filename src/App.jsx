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
  ScanSearch,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TerminalSquare,
  Wrench,
} from "lucide-react";

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
    failedAttempts: 0,
    bannedIps: [],
    lastEvent: "Aucun audit lance",
    events: [],
  },
};

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
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

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
      }));
    });
    socket.on("dashboard-update", (payload) => {
      setData((prev) => ({ ...prev, ...payload, live: { ...prev.live, ...payload.live } }));
      setRunning(Boolean(payload.running));
      setError("");
    });

    return () => socket.disconnect();
  }, []);

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
