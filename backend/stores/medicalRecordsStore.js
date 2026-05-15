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
  const seen = new Set();
  for (const p of candidates) {
    const abs = path.resolve(p);
    if (seen.has(abs)) continue;
    seen.add(abs);
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
    console.warn("[carevia] mysql2 not available, using in-memory store:", e.message);
    return null;
  }
}

function initStore() {
  pool = tryCreatePool();
  if (pool) {
    console.log("[carevia] Medical records: MySQL pool enabled");
  } else {
    console.log("[carevia] Medical records: in-memory store (set MYSQL_HOST to use MySQL)");
  }
}

function rowFromDb(r) {
  let measurements = r.measurements;
  if (typeof measurements === "string") {
    try {
      measurements = JSON.parse(measurements);
    } catch {
      measurements = {};
    }
  }
  return {
    id: r.id,
    patient_id: r.patient_id,
    doctor_id: r.doctor_id,
    specialty: r.specialty,
    disease: r.disease,
    date: r.record_date instanceof Date ? r.record_date.toISOString().slice(0, 10) : String(r.record_date).slice(0, 10),
    measurements: measurements && typeof measurements === "object" ? measurements : {},
    notes: r.notes || "",
    created_at: r.created_at,
  };
}

function rowFromMemory(r) {
  return {
    id: r.id,
    patient_id: r.patient_id,
    doctor_id: r.doctor_id,
    specialty: r.specialty,
    disease: r.disease,
    date: String(r.date).slice(0, 10),
    measurements: r.measurements && typeof r.measurements === "object" ? r.measurements : {},
    notes: r.notes || "",
    created_at: r.created_at,
  };
}

async function listByPatient(patientId, filterSpecialty = null) {
  if (pool) {
    let query = `SELECT id, patient_id, doctor_id, specialty, disease, record_date, measurements, notes, created_at
                 FROM medical_records WHERE patient_id = ?`;
    const params = [patientId];
    
    if (filterSpecialty) {
      query += ` AND specialty = ?`;
      params.push(filterSpecialty);
    }
    
    query += ` ORDER BY record_date DESC, id DESC`;
    
    const [rows] = await pool.query(query, params);
    return rows.map(rowFromDb);
  }
  
  return memory
    .filter((r) => r.patient_id === patientId && (!filterSpecialty || r.specialty === filterSpecialty))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.id - a.id)
    .map(rowFromMemory);
}

async function insert({ patient_id, doctor_id, specialty, disease, date, measurements, notes }) {
  const meas = measurements && typeof measurements === "object" ? measurements : {};
  const notesStr = notes != null ? String(notes) : "";
  if (pool) {
    const [res] = await pool.query(
      `INSERT INTO medical_records (patient_id, doctor_id, specialty, disease, record_date, measurements, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patient_id, doctor_id || null, specialty || null, disease, date, JSON.stringify(meas), notesStr || null]
    );
    const id = res.insertId;
    const [rows] = await pool.query(
      `SELECT id, patient_id, doctor_id, specialty, disease, record_date, measurements, notes, created_at
       FROM medical_records WHERE id = ?`,
      [id]
    );
    return rowFromDb(rows[0]);
  }
  const rec = {
    id: memoryId++,
    patient_id,
    doctor_id,
    specialty,
    disease,
    date,
    measurements: { ...meas },
    notes: notesStr,
    created_at: new Date().toISOString(),
  };
  memory.push(rec);
  return { ...rec };
}

async function countRecentDays(days, filterSpecialty = null) {
  const d = Math.max(1, Number(days) || 7);
  if (pool) {
    let query = `SELECT COUNT(*) AS c FROM medical_records WHERE record_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)`;
    const params = [d - 1];
    
    if (filterSpecialty) {
      query += ` AND specialty = ?`;
      params.push(filterSpecialty);
    }
    
    const [rows] = await pool.query(query, params);
    return Number(rows[0]?.c || 0);
  }
  
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (d - 1));
  const ymd = cutoff.toISOString().slice(0, 10);
  
  return memory.filter((r) => 
    String(r.date) >= ymd && 
    (!filterSpecialty || r.specialty === filterSpecialty)
  ).length;
}

module.exports = { initStore, listByPatient, insert, countRecentDays, isUsingMySQL: () => !!pool };
