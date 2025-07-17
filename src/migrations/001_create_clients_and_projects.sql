-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_clients_name (name)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id INT NOT NULL,
  team_id INT NOT NULL,
  status ENUM('Active', 'Inactive', 'Completed', 'On Hold') DEFAULT 'Active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE RESTRICT,
  INDEX idx_projects_name (name),
  INDEX idx_projects_client (client_id),
  INDEX idx_projects_team (team_id),
  INDEX idx_projects_status (status)
);

-- Insert sample clients
INSERT INTO clients (name) VALUES
('Tech Corp'),
('Global Solutions'),
('Innovation Labs'),
('Digital Dynamics'),
('Future Systems');

-- Insert sample projects (assuming teams with IDs 1-4 exist)
INSERT INTO projects (name, description, client_id, team_id, status, start_date) VALUES
('E-commerce Platform', 'Complete e-commerce solution with React and Node.js', 1, 1, 'Active', '2024-01-15'),
('Mobile App Development', 'Cross-platform mobile application using React Native', 1, 2, 'Active', '2024-02-01'),
('Data Analytics Dashboard', 'Real-time analytics dashboard for business intelligence', 2, 3, 'Active', '2024-01-20'),
('Cloud Migration', 'Migration of legacy systems to cloud infrastructure', 2, 4, 'Active', '2024-03-01'),
('AI Chatbot Integration', 'Implementation of AI-powered customer service chatbot', 3, 1, 'Active', '2024-02-15'),
('CRM System', 'Custom customer relationship management system', 3, 2, 'Completed', '2023-11-01'),
('Inventory Management', 'Automated inventory tracking and management system', 4, 3, 'Active', '2024-01-10'),
('Payment Gateway', 'Secure payment processing integration', 4, 4, 'On Hold', '2024-04-01'),
('Social Media Platform', 'Community-driven social media application', 5, 1, 'Active', '2024-03-15'),
('Blockchain Wallet', 'Cryptocurrency wallet with multi-chain support', 5, 2, 'Active', '2024-02-20');
