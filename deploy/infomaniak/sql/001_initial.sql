CREATE TABLE IF NOT EXISTS hc_saves (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slot_key VARCHAR(80) NOT NULL,
  player_name VARCHAR(120) NULL,
  game_version VARCHAR(40) NULL,
  payload LONGTEXT NOT NULL,
  checksum CHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_hc_saves_slot (slot_key),
  KEY idx_hc_saves_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hc_save_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slot_key VARCHAR(80) NOT NULL,
  payload LONGTEXT NOT NULL,
  checksum CHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_hc_save_history_slot_created (slot_key, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
