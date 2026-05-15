const express = require("express");
const store = require("../stores/medicalRecordsStore");

const router = express.Router();

// Helper to get doctor info from headers
function getDoctorInfo(req) {
  return {
    email: req.headers["x-doctor-email"],
    specialty: req.headers["x-doctor-specialty"],
  };
}

router.get("/stats/recent", async (req, res) => {
  try {
    const { specialty } = getDoctorInfo(req);
    const days = Number(req.query.days) || 7;
    const count = await store.countRecentDays(days, specialty);
    res.json({ count, days, storage: store.isUsingMySQL() ? "mysql" : "memory" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

router.get("/patients/:patientId/medical-records", async (req, res) => {
  try {
    const { specialty } = getDoctorInfo(req);
    // In a real app, we'd also verify the patient belongs to this doctor/specialty
    const list = await store.listByPatient(req.params.patientId, specialty);
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load medical records" });
  }
});

router.post("/patients/:patientId/medical-records", async (req, res) => {
  try {
    const { email, specialty } = getDoctorInfo(req);
    if (!email) {
      return res.status(401).json({ error: "Doctor identity required" });
    }

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
      doctor_id: email,
      specialty: specialty,
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
