const fs = require("fs");
const path = require("path");

let pool = null;
let memory = [];
let memoryId = 1;

function loadEnv() {
  const candidates = [
    path.join(__dirname, ".env"),
    path.join(__dirname, "..", ".env"),
    path.join(process.cwd(), ".env"),
  ];
  for (const p of candidates) {
    const abs = path.resolve(p);
    if (fs.existsSync(abs)) {
      require("dotenv").config({ path: abs, override: false });
    }
  }
}

function tryCreatePool() {
  loadEnv();
  const host = process.env.MYSQL_HOST;
  if (!host) return null;
  try {
    const mysql = require("mysql2/promise");
    return mysql.createPool({
      host,
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "carevia",
      waitForConnections: true,
      connectionLimit: 10,
    });
  } catch (e) {
    return null;
  }
}

function initStore() {
  pool = tryCreatePool();
}

function rowFromDb(r) {
  return {
    id: r.id,
    patient_id: r.patient_id,
    doctor_id: r.doctor_id,
    date: r.appointment_date,
    status: r.status,
    notes: r.notes || "",
    created_at: r.created_at,
  };
}

async function listByDoctor(doctorId) {
  if (pool) {
    const [rows] = await pool.query(
      "SELECT * FROM appointments WHERE doctor_id = ? ORDER BY appointment_date ASC",
      [doctorId]
    );
    return rows.map(rowFromDb);
  }
  return memory
    .filter(a => a.doctor_id === doctorId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

async function insert({ patient_id, doctor_id, date, status, notes }) {
  if (pool) {
    const [res] = await pool.query(
      "INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, notes) VALUES (?, ?, ?, ?, ?)",
      [patient_id, doctor_id, date, status || "Scheduled", notes || null]
    );
    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [res.insertId]);
    return rowFromDb(rows[0]);
  }
  const rec = {
    id: memoryId++,
    patient_id,
    doctor_id,
    date,
    status: status || "Scheduled",
    notes: notes || "",
    created_at: new Date().toISOString(),
  };
  memory.push(rec);
  return rec;
}

async function updateStatus(id, doctorId, status) {
  if (pool) {
    await pool.query(
      "UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?",
      [status, id, doctorId]
    );
    const [rows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [id]);
    return rows[0] ? rowFromDb(rows[0]) : null;
  }
  const idx = memory.findIndex(a => a.id == id && a.doctor_id === doctorId);
  if (idx !== -1) {
    memory[idx].status = status;
    return memory[idx];
  }
  return null;
}

async function deleteAppointment(id, doctorId) {
  if (pool) {
    await pool.query("DELETE FROM appointments WHERE id = ? AND doctor_id = ?", [id, doctorId]);
    return true;
  }
  const idx = memory.findIndex(a => a.id == id && a.doctor_id === doctorId);
  if (idx !== -1) {
    memory.splice(idx, 1);
    return true;
  }
  return false;
}

module.exports = { initStore, listByDoctor, insert, updateStatus, deleteAppointment };
