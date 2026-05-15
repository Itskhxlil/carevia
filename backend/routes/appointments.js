const express = require("express");
const store = require("../stores/appointmentsStore");

const router = express.Router();

function getDoctorEmail(req) {
  return req.headers["x-doctor-email"];
}

router.get("/", async (req, res) => {
  try {
    const email = getDoctorEmail(req);
    if (!email) return res.status(401).json({ error: "Unauthorized" });
    const list = await store.listByDoctor(email);
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const email = getDoctorEmail(req);
    if (!email) return res.status(401).json({ error: "Unauthorized" });
    const { patient_id, date, status, notes } = req.body;
    if (!patient_id || !date) return res.status(400).json({ error: "Missing fields" });
    
    const row = await store.insert({
      patient_id,
      doctor_id: email,
      date,
      status,
      notes
    });
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const email = getDoctorEmail(req);
    const { status } = req.body;
    const row = await store.updateStatus(req.params.id, email, status);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const email = getDoctorEmail(req);
    const ok = await store.deleteAppointment(req.params.id, email);
    res.json({ success: ok });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
