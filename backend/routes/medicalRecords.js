const express = require("express");
const store = require("../medicalRecordsStore");

const router = express.Router();

router.get("/stats/recent", async (_req, res) => {
  try {
    const days = Number(_req.query.days) || 7;
    const count = await store.countRecentDays(days);
    res.json({ count, days, storage: store.isUsingMySQL() ? "mysql" : "memory" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

router.get("/patients/:patientId/medical-records", async (req, res) => {
  try {
    const list = await store.listByPatient(req.params.patientId);
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load medical records" });
  }
});

router.post("/patients/:patientId/medical-records", async (req, res) => {
  try {
    const patient_id = req.params.patientId;
    const { disease, date, measurements, notes } = req.body || {};
    if (!disease || String(disease).trim() === "") {
      return res.status(400).json({ error: "disease is required" });
    }
    if (!date || String(date).trim() === "") {
      return res.status(400).json({ error: "date is required" });
    }
    if (measurements == null || typeof measurements !== "object" || Array.isArray(measurements)) {
      return res.status(400).json({ error: "measurements must be an object" });
    }
    const row = await store.insert({
      patient_id,
      disease: String(disease).trim(),
      date: String(date).slice(0, 10),
      measurements,
      notes,
    });
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to save medical record" });
  }
});

module.exports = router;
