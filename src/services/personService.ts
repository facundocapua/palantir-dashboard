import { executeQuery } from '@/lib/db';
import { PersonWithTeamAndRole, Person } from '@/types/database';

interface PersonWithTeamAndRoleRaw {
  id: number;
  name: string;
  seniority: string | null;
  contract: string | null;
  team_id: number | null;
  role_id: number | null;
  english_level: string | null;
  monthly_hours: number;
  team_name: string | null;
  role_name: string | null;
}

interface InsertResult {
  insertId: number;
  affectedRows: number;
}

interface UpdateResult {
  affectedRows: number;
  changedRows: number;
}

export class PersonService {
  // Get all people
  static async getAllPeople(): Promise<PersonWithTeamAndRole[]> {
    const query = `
      SELECT 
        p.*,
        t.name as team_name,
        r.name as role_name
      FROM people p
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN roles r ON p.role_id = r.id
      ORDER BY p.name
    `;
    
    const result = await executeQuery(query) as PersonWithTeamAndRoleRaw[];
    
    return result.map(person => ({
      id: person.id,
      name: person.name,
      seniority: person.seniority as 'JR I' | 'JR II' | 'SSR I' | 'SSR II' | 'SR I' | 'SR II' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
      english_level: person.english_level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null,
      monthly_hours: person.monthly_hours,
      team: person.team_name ? {
        id: person.team_id || 0,
        name: person.team_name,
      } : null,
      roleDetail: person.role_name ? {
        id: person.role_id || 0,
        name: person.role_name,
      } : null
    }));
  }

  // Get person by ID
  static async getPersonById(id: number): Promise<PersonWithTeamAndRole | null> {
    const query = `
      SELECT 
        p.*,
        t.name as team_name,
        r.name as role_name
      FROM people p
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN roles r ON p.role_id = r.id
      WHERE p.id = ?
    `;
    
    const result = await executeQuery(query, [id]) as PersonWithTeamAndRoleRaw[];
    
    if (!result[0]) return null;
    
    const person = result[0];
    
    return {
      id: person.id,
      name: person.name,
      seniority: person.seniority as 'JR I' | 'JR II' | 'SSR I' | 'SSR II' | 'SR I' | 'SR II' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
      english_level: person.english_level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null,
      monthly_hours: person.monthly_hours,
      team: person.team_name ? {
        id: person.team_id || 0,
        name: person.team_name,
      } : null,
      roleDetail: person.role_name ? {
        id: person.role_id || 0,
        name: person.role_name,
      } : null
    };
  }

  // Get people by team
  static async getPeopleByTeam(teamId: number): Promise<PersonWithTeamAndRole[]> {
    const query = `
      SELECT 
        p.*,
        t.name as team_name,
        r.name as role_name
      FROM people p
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN roles r ON p.role_id = r.id
      WHERE p.team_id = ?
      ORDER BY p.name
    `;
    
    const result = await executeQuery(query, [teamId]) as PersonWithTeamAndRoleRaw[];
    
    return result.map(person => ({
      id: person.id,
      name: person.name,
      seniority: person.seniority as 'JR I' | 'JR II' | 'SSR I' | 'SSR II' | 'SR I' | 'SR II' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
      english_level: person.english_level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null,
      monthly_hours: person.monthly_hours,
      team: person.team_name ? {
        id: person.team_id || 0,
        name: person.team_name,
      } : null,
      roleDetail: person.role_name ? {
        id: person.role_id || 0,
        name: person.role_name,
      } : null
    }));
  }

  // Search people by name
  static async searchPeople(searchTerm: string): Promise<PersonWithTeamAndRole[]> {
    const query = `
      SELECT 
        p.*,
        t.name as team_name,
        r.name as role_name
      FROM people p
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN roles r ON p.role_id = r.id
      WHERE p.name LIKE ?
      ORDER BY p.name
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const result = await executeQuery(query, [searchPattern]) as PersonWithTeamAndRoleRaw[];
    
    return result.map(person => ({
      id: person.id,
      name: person.name,
      seniority: person.seniority as 'JR I' | 'JR II' | 'SSR I' | 'SSR II' | 'SR I' | 'SR II' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
      english_level: person.english_level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null,
      monthly_hours: person.monthly_hours,
      team: person.team_name ? {
        id: person.team_id || 0,
        name: person.team_name,
      } : null,
      roleDetail: person.role_name ? {
        id: person.role_id || 0,
        name: person.role_name,
      } : null
    }));
  }

  // Create a new person
  static async createPerson(person: Omit<Person, 'id'>): Promise<PersonWithTeamAndRole> {
    const query = `
      INSERT INTO people (name, seniority, contract, team_id, role_id, english_level, monthly_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const result = await executeQuery(query, [
      person.name,
      person.seniority,
      person.contract,
      person.team_id,
      person.role_id,
      person.english_level,
      person.monthly_hours
    ]) as InsertResult;
    
    const newPersonId = result.insertId;
    const newPerson = await this.getPersonById(newPersonId);
    
    if (!newPerson) {
      throw new Error('Failed to create person');
    }
    
    return newPerson;
  }

  // Update a person
  static async updatePerson(id: number, person: Partial<Omit<Person, 'id'>>): Promise<PersonWithTeamAndRole> {
    const fields = [];
    const values = [];
    
    if (person.name !== undefined) {
      fields.push('name = ?');
      values.push(person.name);
    }
    if (person.seniority !== undefined) {
      fields.push('seniority = ?');
      values.push(person.seniority);
    }
    if (person.contract !== undefined) {
      fields.push('contract = ?');
      values.push(person.contract);
    }
    if (person.team_id !== undefined) {
      fields.push('team_id = ?');
      values.push(person.team_id);
    }
    if (person.role_id !== undefined) {
      fields.push('role_id = ?');
      values.push(person.role_id);
    }
    if (person.english_level !== undefined) {
      fields.push('english_level = ?');
      values.push(person.english_level);
    }
    if (person.monthly_hours !== undefined) {
      fields.push('monthly_hours = ?');
      values.push(person.monthly_hours);
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    const query = `UPDATE people SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    await executeQuery(query, values);
    
    const updatedPerson = await this.getPersonById(id);
    
    if (!updatedPerson) {
      throw new Error('Person not found after update');
    }
    
    return updatedPerson;
  }

  // Delete a person
  static async deletePerson(id: number): Promise<boolean> {
    const query = 'DELETE FROM people WHERE id = ?';
    const result = await executeQuery(query, [id]) as UpdateResult;
    
    return result.affectedRows > 0;
  }
}
