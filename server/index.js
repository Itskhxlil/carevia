const path = require("path");
const fs = require("fs");

(function loadEnv() {
  const candidates = [
    path.join(__dirname, ".env"),
    path.join(__dirname, "..", ".env"),
    path.join(process.cwd(), ".env"),
  ];
  const seen = new Set();
  for (const p of candidates) {
    const abs = path.resolve(p);
    if (seen.has(abs)) continue;
    seen.add(abs);
    if (fs.existsSync(abs)) require("dotenv").config({ path: abs, override: true });
  }
})();

const express = require("express");
const cors = require("cors");
const store = require("./medicalRecordsStore");
const medicalRoutes = require("./routes/medicalRecords");

store.initStore();

const PORT = Number(process.env.API_PORT) || 3001;
const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "512kb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "carevia-api",
    medicalRecords: store.isUsingMySQL() ? "mysql" : "memory",
  });
});

app.use("/api", medicalRoutes);

app.listen(PORT, () => {
  console.log(`Carevia API http://localhost:${PORT}`);
});
