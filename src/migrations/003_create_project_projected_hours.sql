-- Create project_projected_hours table for tracking projected hours per project per month
CREATE TABLE IF NOT EXISTS project_projected_hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL CHECK (month >= 1 AND month <= 12),
  projected_hours INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_month (project_id, year, month),
  INDEX idx_projected_hours_project (project_id),
  INDEX idx_projected_hours_date (year, month)
);
