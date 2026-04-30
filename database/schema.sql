-- Carevia: flexible medical monitoring records (MySQL 5.7+ / 8+)
-- Run: mysql -u user -p carevia < database/schema.sql

CREATE TABLE IF NOT EXISTS medical_records (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id VARCHAR(64) NOT NULL COMMENT 'Matches app registry id e.g. PT-173...',
  disease VARCHAR(255) NOT NULL,
  record_date DATE NOT NULL,
  measurements JSON NOT NULL COMMENT 'Arbitrary key-value vitals',
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_medical_records_patient (patient_id),
  KEY idx_medical_records_patient_date (patient_id, record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
