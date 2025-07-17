import { executeQuery } from '@/lib/db';
import { Client, ClientWithProjectCount } from '@/types/database';

interface InsertResult {
  insertId: number;
  affectedRows: number;
}

interface UpdateResult {
  affectedRows: number;
  changedRows: number;
}

interface DeleteResult {
  affectedRows: number;
}

export class ClientService {
  // Get all clients
  static async getAllClients(): Promise<Client[]> {
    const query = 'SELECT * FROM clients ORDER BY name ASC';
    const results = await executeQuery(query) as Client[];
    return results;
  }

  // Get all clients with project count
  static async getAllClientsWithProjectCount(): Promise<ClientWithProjectCount[]> {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as projectCount
      FROM clients c
      LEFT JOIN projects p ON c.id = p.client_id
      GROUP BY c.id, c.name
      ORDER BY c.name ASC
    `;
    const results = await executeQuery(query) as ClientWithProjectCount[];
    return results;
  }

  // Get client by ID
  static async getClientById(id: number): Promise<Client | null> {
    const query = 'SELECT * FROM clients WHERE id = ?';
    const results = await executeQuery(query, [id]) as Client[];
    return results.length > 0 ? results[0] : null;
  }

  // Create new client
  static async createClient(clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const query = `
      INSERT INTO clients (name)
      VALUES (?)
    `;
    const result = await executeQuery(query, [
      clientData.name
    ]) as InsertResult;
    
    return result.insertId;
  }

  // Update client
  static async updateClient(id: number, clientData: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (clientData.name !== undefined) {
      fields.push('name = ?');
      values.push(clientData.name);
    }

    if (fields.length === 0) {
      return false;
    }

    const query = `UPDATE clients SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const result = await executeQuery(query, values) as UpdateResult;
    return result.affectedRows > 0;
  }

  // Delete client
  static async deleteClient(id: number): Promise<boolean> {
    // First check if client has projects
    const projectCountQuery = 'SELECT COUNT(*) as count FROM projects WHERE client_id = ?';
    const projectCountResult = await executeQuery(projectCountQuery, [id]) as [{ count: number }];
    
    if (projectCountResult[0].count > 0) {
      throw new Error('Cannot delete client with associated projects');
    }

    const query = 'DELETE FROM clients WHERE id = ?';
    const result = await executeQuery(query, [id]) as DeleteResult;
    return result.affectedRows > 0;
  }

  // Search clients by name
  static async searchClientsByName(searchTerm: string): Promise<Client[]> {
    const query = 'SELECT * FROM clients WHERE name LIKE ? ORDER BY name ASC';
    const results = await executeQuery(query, [`%${searchTerm}%`]) as Client[];
    return results;
  }

  // Check if email exists (for validation)
  static async nameExists(name: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM clients WHERE name = ?';
    const params: unknown[] = [name];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const result = await executeQuery(query, params) as [{ count: number }];
    return result[0].count > 0;
  }
}
