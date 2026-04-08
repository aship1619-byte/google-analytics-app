-- ============================================================
-- TABLE: insights_alerts
-- Stores midnight AI pre-computed intelligence and tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS insights_alerts (
  id                INT           NOT NULL AUTO_INCREMENT,
  property_id       VARCHAR(255)  NOT NULL,
  record_date       DATE          NOT NULL,
  
  -- Generative AI Payloads
  insights_json     JSON          NOT NULL,
  alerts_json       JSON          NOT NULL,
  
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
  PRIMARY KEY (id),
  -- A property can only have one explicit AI summary per day to prevent duplicated overnight cron hits
  UNIQUE KEY uq_property_date (property_id, record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
