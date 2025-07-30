-- Add repository column to projects table
ALTER TABLE projects 
ADD COLUMN repository VARCHAR(255) NULL
AFTER description;
