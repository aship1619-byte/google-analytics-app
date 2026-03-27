-- ============================================================
-- TABLE: daily_analytics
-- Stores daily aggregated Google Analytics data fetched by cron
-- ============================================================
 
CREATE TABLE IF NOT EXISTS daily_analytics (
  id                INT           NOT NULL AUTO_INCREMENT,
  property_id       VARCHAR(255)  NOT NULL,
  record_date       DATE          NOT NULL,
  
  -- Core Metrics
  users             INT           NOT NULL DEFAULT 0,
  new_users         INT           NOT NULL DEFAULT 0,
  sessions          INT           NOT NULL DEFAULT 0,
  page_views        INT           NOT NULL DEFAULT 0,
  bounce_rate       DECIMAL(5,4)  NOT NULL DEFAULT 0.0000,
  avg_session_duration DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  customer_actions  INT           NOT NULL DEFAULT 0,

  -- JSON Breakdown Data
  device_data       JSON          NULL,
  source_data       JSON          NULL,
  page_data         JSON          NULL,
  event_data        JSON          NULL,
  location_data     JSON          NULL,
  hourly_data       JSON          NULL,

  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
  PRIMARY KEY (id),
  -- A property can only have one set of data per specific date
  UNIQUE KEY uq_property_date (property_id, record_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
