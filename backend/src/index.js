import http from "node:http";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { getDefaultAudit, runAudit } from "./auditEngine.js";

config({ path: "../.env" });
config();

const app = express();
const server = http.createServer(app);
const port = Number(process.env.BACKEND_PORT || 3001);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "*";

const io = new Server(server, {
  cors: {
    origin: frontendOrigin,
    methods: ["GET", "POST"],
  },
});

let latestAudit = getDefaultAudit();
let running = false;

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, running });
});

app.get("/api/audit", (_req, res) => {
  res.json({ ...latestAudit, running });
});

app.post("/api/audit/run", async (_req, res) => {
  if (running) {
    res.status(409).json({ error: "Audit already running" });
    return;
  }

  running = true;
  io.emit("audit:status", { running: true });
  res.status(202).json({ accepted: true });

  try {
    latestAudit = await runAudit({
      emit: (eventName, payload) => io.emit(eventName, payload),
    });
    io.emit("dashboard-update", latestAudit);
  } catch (error) {
    const failure = {
      time: new Date().toLocaleTimeString("fr-FR", { hour12: false }),
      type: "error",
      level: "critical",
      message: error.message,
    };
    latestAudit = {
      ...latestAudit,
      live: {
        ...latestAudit.live,
        attackStatus: "Erreur",
        lastEvent: error.message,
        events: [failure, ...(latestAudit.live.events || [])],
      },
    };
    io.emit("audit:progress", failure);
    io.emit("dashboard-update", latestAudit);
  } finally {
    running = false;
    io.emit("audit:status", { running: false });
  }
});

io.on("connection", (socket) => {
  socket.emit("dashboard-update", { ...latestAudit, running });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Audit backend listening on ${port}`);
});
