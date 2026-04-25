import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import {
  Activity,
  Ban,
  BrickWallShield,
  FileSearch,
  Globe,
  Lock,
  Radar,
  ScanSearch,
  Server,
  Shield,
  ShieldCheck,
  ShieldAlert,
  TerminalSquare,
  Wrench,
} from "lucide-react";

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
    attackStatus: "Monitoring",
    failedAttempts: 0,
    bannedIps: [],
    lastEvent: "Aucun événement récent",
    events: [],
  },
};

function SeverityBadge({ level }) {
  const cls =
    level === "Critique"
      ? "severity critical"
      : level === "Haute"
        ? "severity high"
        : "severity medium";

  return <span className={cls}>{level}</span>;
}

function LiveEventBadge({ level }) {
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
  const Icon = tool.icon;

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
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const socket = io("http://192.168.56.101:3001", {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });

    socket.on("dashboard-update", (payload) => {
      setData((prev) => ({
        ...prev,
        ...payload,
        live: {
          ...prev.live,
          ...(payload.live || {}),
        },
      }));
    });

    socket.on("connect", () => {
      console.log("Connected to backend");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="dashboard">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="chip">ESAIP 4A • AUDIT SYSTÈME • VM LINUX</div>
          <h1>Dashboard d’audit et de durcissement sécurité</h1>
          <p>
            Vue consolidée du diagnostic, des outils utilisés, des actions de
            hardening et de la supervision temps réel du serveur.
          </p>
        </div>

        <div className="hero-side">
          <div className="hero-metric-card">
            <span>Progression du hardening</span>
            <strong>
              +{data.scoreAfter - data.scoreBefore} <small>pts Lynis</small>
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
                <span>Conformité</span>
                <strong>{data.compliance}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card danger">
          <h3>Score Lynis Avant</h3>
          <div className="big-number red-text">{data.scoreBefore}</div>
          <p>Référence initiale avant corrections</p>
        </div>

        <div className="stat-card success">
          <h3>Score Lynis Après</h3>
          <div className="big-number green-text">{data.scoreAfter}</div>
          <p>État après durcissement du serveur</p>
        </div>

        <div className="stat-card info">
          <h3>UFW</h3>
          <div className="big-status cyan-text">{data.ufw}</div>
          <p>Filtrage réseau côté hôte</p>
        </div>

        <div className="stat-card accent">
          <h3>Fail2Ban</h3>
          <div className="big-status purple-text">{data.fail2ban}</div>
          <p>Blocage automatique des IP suspectes</p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Outils utilisés pendant l’audit</h2>
          <span className="panel-pill">Méthodologie</span>
        </div>

        <div className="tools-grid">
          {data.tools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Phase 4 : surveillance continue</h2>
          <span className="panel-pill">Détection & traçabilité</span>
        </div>

        <div className="tools-grid">
          {data.continuousMonitoring.map((tool) => (
            <ToolCard
              key={tool.name}
              tool={{
                name: tool.name,
                category: tool.role,
                description: tool.description,
                impact: tool.outcome,
                icon: tool.icon,
              }}
            />
          ))}
        </div>

        <div className="evidence-list monitoring-goals">
          {data.monitoringGoals.map((goal) => (
            <div key={goal} className="evidence-item">
              <Wrench size={16} />
              <span>{goal}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Phase 3 : durcissement du système</h2>
          <span className="panel-pill">Réduction du risque</span>
        </div>

        <div className="tools-grid">
          {data.hardeningActions.map((action) => (
            <ToolCard key={action.name} tool={action} />
          ))}
        </div>

        <div className="evidence-list monitoring-goals">
          {data.hardeningGoals.map((goal) => (
            <div key={goal} className="evidence-item">
              <Wrench size={16} />
              <span>{goal}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="triple-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Ports ouverts détectés</h2>
            <span className="panel-pill">Nmap / ss</span>
          </div>

          <div className="ports-grid">
            {data.ports.map((port) => (
              <div key={port} className="port-card">
                {port}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Services suivis</h2>
            <span className="panel-pill">État système</span>
          </div>

          <div className="services-list">
            {data.services.map((service) => (
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
            {data.evidence.map((item) => (
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
            <h2>Vulnérabilités principales</h2>
            <span className="panel-pill">Audit initial</span>
          </div>

          <div className="vuln-grid">
            {data.vulnerabilities.map((item) => (
              <div key={item.name} className="vuln-card">
                <div className="vuln-top">
                  <h3>{item.name}</h3>
                  <SeverityBadge level={item.severity} />
                </div>

                <div className="vuln-block">
                  <p className="label before-label">Avant</p>
                  <p className="value">{item.before}</p>
                </div>

                <div className="vuln-block">
                  <p className="label after-label">Après</p>
                  <p className="value">{item.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel live-panel">
          <div className="panel-header">
            <h2>Supervision live</h2>
            <span className="panel-pill live-pill">Temps réel</span>
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
              <strong>{data.live.attackStatus}</strong>
            </div>

            <div className="live-mini-card">
              <span>Échecs SSH</span>
              <strong>{data.live.failedAttempts}</strong>
            </div>
          </div>

          <div className="live-section">
            <div className="live-box">
              <h3>Dernier événement</h3>
              <p>{data.live.lastEvent}</p>
            </div>

            <div className="live-box">
              <h3>IP bannies</h3>
              <div className="banned-list">
                {data.live.bannedIps.length > 0 ? (
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
            <h3>Flux d’événements</h3>

            {data.live.events && data.live.events.length > 0 ? (
              data.live.events.map((event, index) => (
                <div key={`${event.time}-${index}`} className="live-event-card">
                  <div className="live-event-top">
                    <span className="event-time">
                      {event.time} • {event.type}
                    </span>
                    <LiveEventBadge level={event.level} />
                  </div>
                  <p>{event.message}</p>
                </div>
              ))
            ) : (
              <div className="live-event-card">
                <p>Aucun événement live pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Timeline de durcissement</h2>
          <span className="panel-pill">Étapes clés</span>
        </div>

        <div className="timeline">
          {data.hardeningSteps.map((step, index) => (
            <div key={step.title} className="timeline-item">
              <div className="timeline-marker">{index + 1}</div>
              <div className="timeline-content">
                <div className="timeline-top">
                  <h3>{step.title}</h3>
                  <span>{step.status}</span>
                </div>
                <p>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel comparison-panel">
        <div className="panel-header">
          <h2>Table de comparaison avant / après</h2>
          <span className="panel-pill">Synthèse finale</span>
        </div>

        <div className="table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Élément</th>
                <th>Avant correction</th>
                <th>Après correction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Score Lynis</td>
                <td>Faible, alertes multiples</td>
                <td>Hardening Index : 70</td>
              </tr>
              <tr>
                <td>Nmap</td>
                <td>Visibilité limitée des services exposés</td>
                <td>Cartographie réseau réalisée</td>
              </tr>
              <tr>
                <td>Nikto</td>
                <td>Analyse web absente</td>
                <td>Contrôle des faiblesses web réalisé</td>
              </tr>
              <tr>
                <td>UFW</td>
                <td>Pare-feu inactif ou insuffisant</td>
                <td>Pare-feu actif</td>
              </tr>
              <tr>
                <td>SSH</td>
                <td>Configuration permissive</td>
                <td>Accès distant durci</td>
              </tr>
              <tr>
                <td>Fail2Ban</td>
                <td>Protection brute force absente</td>
                <td>Blocage automatique activé</td>
              </tr>
              <tr>
                <td>Mots de passe</td>
                <td>Politique faible</td>
                <td>Exigences renforcées</td>
              </tr>
              <tr>
                <td>Services inutiles</td>
                <td>Surface d’attaque plus large</td>
                <td>Services superflus désactivés</td>
              </tr>
              <tr>
                <td>Paramètres sysctl</td>
                <td>Paramètres par défaut</td>
                <td>Configuration système durcie</td>
              </tr>
              <tr>
                <td>AppArmor</td>
                <td>Confinement absent ou faible</td>
                <td>Profils de confinement activés</td>
              </tr>
              <tr>
                <td>Permissions</td>
                <td>Droits trop larges</td>
                <td>Permissions réduites</td>
              </tr>
              <tr>
                <td>Chkrootkit</td>
                <td>Pas de vérification anti-rootkit</td>
                <td>Détection locale ajoutée</td>
              </tr>
              <tr>
                <td>Rkhunter</td>
                <td>Pas de contrôle approfondi d’intégrité</td>
                <td>Vérification complémentaire activée</td>
              </tr>
              <tr>
                <td>ClamAV</td>
                <td>Pas de contrôle antivirus dédié</td>
                <td>Détection de malwares ajoutée</td>
              </tr>
              <tr>
                <td>YARA</td>
                <td>Pas de détection par règles</td>
                <td>Analyse des artefacts suspects activée</td>
              </tr>
              <tr>
                <td>Surface d’attaque</td>
                <td>Importante</td>
                <td>Réduite</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="footer-note">
        <TerminalSquare size={18} />
        <p>
          Dashboard prêt pour démonstration, capture d’écran, dépôt GitHub et
          soutenance de projet d’audit sécurité.
        </p>
      </section>
    </div>
  );
}
