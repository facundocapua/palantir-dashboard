-- Create GitHub statistics table for weekly repository metrics
CREATE TABLE IF NOT EXISTS github_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  week_date DATE NOT NULL COMMENT 'Start date of the week (Monday)',
  additions INT DEFAULT 0 COMMENT 'Total lines added during the week',
  deletions INT DEFAULT 0 COMMENT 'Total lines deleted during the week',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_week (project_id, week_date),
  INDEX idx_github_stats_project (project_id),
  INDEX idx_github_stats_week (week_date),
  INDEX idx_github_stats_project_week (project_id, week_date)
) COMMENT 'Weekly GitHub statistics for project repositories';
