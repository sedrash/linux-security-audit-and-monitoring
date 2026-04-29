import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import { buildSshConfig, runAudit } from "./auditEngine.js";

const app = express();
const server = http.createServer(app);
const port = Number(process.env.BACKEND_PORT || 3001);
const corsOrigin = process.env.CORS_ORIGIN || "*";

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
  },
});

let currentAudit = {
  live: {
    serverIp: buildSshConfig().targetHost,
    sshPort: String(buildSshConfig().port),
    attackStatus: "Pret",
    failedAttempts: 0,
    bannedIps: [],
    lastEvent: "Backend pret, audit non lance",
    events: [],
  },
};
let running = false;

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, running, vm: buildSshConfig().host });
});

app.get("/api/audit", (_req, res) => {
  res.json({ running, data: currentAudit });
});

app.post("/api/audit/run", async (_req, res) => {
  if (running) {
    res.status(409).json({ running: true, message: "Un audit est deja en cours." });
    return;
  }

  running = true;
  currentAudit = {
    ...currentAudit,
    live: {
      ...currentAudit.live,
      attackStatus: "Audit en cours",
      lastEvent: "Audit lance",
    },
  };
  io.emit("audit:update", { running, data: currentAudit });
  io.emit("dashboard-update", currentAudit);

  runAudit({
    emit: (eventName, payload) => {
      currentAudit = {
        ...currentAudit,
        live: {
          ...currentAudit.live,
          attackStatus: "Audit en cours",
          lastEvent: payload.message,
          events: [payload, ...(currentAudit.live?.events || [])].slice(0, 20),
        },
      };
      io.emit(eventName, payload);
      io.emit("audit:update", { running, data: currentAudit });
      io.emit("dashboard-update", currentAudit);
    },
  })
    .then((data) => {
      currentAudit = data;
      io.emit("audit:update", { running: false, data: currentAudit });
      io.emit("dashboard-update", currentAudit);
    })
    .catch((error) => {
      currentAudit = {
        ...currentAudit,
        live: {
          ...currentAudit.live,
          attackStatus: "Erreur",
          lastEvent: error.message,
          events: [
            {
              time: new Date().toLocaleTimeString("fr-FR"),
              type: "Erreur",
              level: "critical",
              message: error.message,
            },
            ...(currentAudit.live?.events || []),
          ].slice(0, 20),
        },
      };
      io.emit("audit:update", { running: false, data: currentAudit, error: error.message });
      io.emit("dashboard-update", currentAudit);
    })
    .finally(() => {
      running = false;
    });

  res.status(202).json({ running: true, message: "Audit lance." });
});

io.on("connection", (socket) => {
  socket.emit("audit:update", { running, data: currentAudit });
  socket.emit("dashboard-update", currentAudit);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Audit backend listening on port ${port}`);
});
