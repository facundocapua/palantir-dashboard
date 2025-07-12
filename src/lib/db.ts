import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'palantir',
  password: 'qwe123',
  database: 'palantir',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
export const db = mysql.createPool(dbConfig);

// Test connection function
export async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL database successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to MySQL database:', error);
    return false;
  }
}

// Execute query function
export async function executeQuery(query: string, params?: unknown[]) {
  try {
    const [results] = await db.execute(query, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}
