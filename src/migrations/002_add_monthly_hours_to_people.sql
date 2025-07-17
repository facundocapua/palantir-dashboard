-- Add monthly_hours field to people table
ALTER TABLE people ADD COLUMN monthly_hours INT DEFAULT 0 COMMENT 'Monthly hours produced by the person';

-- Add index for performance when filtering by monthly hours
CREATE INDEX idx_people_monthly_hours ON people(monthly_hours);
