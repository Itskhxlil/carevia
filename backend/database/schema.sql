CREATE TABLE IF NOT EXISTS `medical_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `patient_id` VARCHAR(64) NOT NULL COMMENT 'Unique identifier for the patient (e.g., PT-173...)',
  `doctor_id` VARCHAR(64) DEFAULT NULL COMMENT 'Identifier for the physician who created this record',
  `disease` VARCHAR(100) NOT NULL COMMENT 'The disease category (e.g., diabetes, cardiology)',
  `specialty` VARCHAR(100) NOT NULL COMMENT 'Medical specialty relevant to this record',
  `record_date` DATE NOT NULL COMMENT 'The date when clinical measurements were recorded',
  `measurements` JSON NOT NULL COMMENT 'Dynamic measurements stored as JSON: diabetes (glucose, hba1c), cardiology (bp, hr), etc.',
  `notes` TEXT DEFAULT NULL COMMENT 'Clinical notes or observations',
  `status` VARCHAR(50) DEFAULT 'Active' COMMENT 'Current status of the record (e.g., Active, Stable, Critical)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_measurements_json` CHECK (JSON_VALID(`measurements`)),
  INDEX `idx_patient_id` (`patient_id`),
  INDEX `idx_patient_record_date` (`patient_id`, `record_date`),
  INDEX `idx_specialty` (`specialty`),
  INDEX `idx_disease` (`disease`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `appointments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `patient_id` VARCHAR(64) NOT NULL COMMENT 'Reference to the patient',
  `doctor_id` VARCHAR(64) NOT NULL COMMENT 'The physician assigned to this appointment',
  `appointment_date` DATETIME NOT NULL COMMENT 'Scheduled date and time',
  `status` ENUM('Scheduled', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
  `notes` TEXT DEFAULT NULL COMMENT 'Optional notes for the visit',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_doctor_app` (`doctor_id`, `appointment_date`),
  INDEX `idx_patient_app` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
