import { executeQuery } from '@/lib/db';
import { Role, PersonWithTeamAndRole } from '@/types/database';

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

interface PersonWithRoleRaw {
  id: number;
  name: string;
  seniority: string | null;
  role: string | null;
  contract: string | null;
  team_id: number | null;
  role_id: number | null;
  team_name: string | null;
  role_name: string;
}

export class RoleService {
  // Get all roles
  static async getAllRoles(): Promise<Role[]> {
    const query = 'SELECT * FROM roles ORDER BY name';
    const result = await executeQuery(query) as Role[];
    return result;
  }

  // Get role by ID
  static async getRoleById(id: number): Promise<Role | null> {
    const query = 'SELECT * FROM roles WHERE id = ?';
    const result = await executeQuery(query, [id]) as Role[];
    return result[0] || null;
  }

  // Create new role
  static async createRole(name: string): Promise<Role> {
    // Validate role name
    if (!name || name.trim().length === 0) {
      throw new Error('Role name is required');
    }
    
    // Check if role name is available
    const nameAvailable = await this.isRoleNameAvailable(name);
    if (!nameAvailable) {
      throw new Error('Role name already exists');
    }
    
    const query = 'INSERT INTO roles (name) VALUES (?)';
    const result = await executeQuery(query, [name.trim()]) as InsertResult;
    
    const newRole = await this.getRoleById(result.insertId);
    if (!newRole) {
      throw new Error('Failed to create role');
    }
    
    return newRole;
  }

  // Update role
  static async updateRole(id: number, name: string): Promise<Role | null> {
    // Validate role name
    if (!name || name.trim().length === 0) {
      throw new Error('Role name is required');
    }
    
    // Check if role exists
    const roleExists = await this.roleExists(id);
    if (!roleExists) {
      return null;
    }
    
    // Check if role name is available
    const nameAvailable = await this.isRoleNameAvailable(name, id);
    if (!nameAvailable) {
      throw new Error('Role name already exists');
    }
    
    const query = 'UPDATE roles SET name = ? WHERE id = ?';
    const result = await executeQuery(query, [name.trim(), id]) as UpdateResult;
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return this.getRoleById(id);
  }

  // Delete role
  static async deleteRole(id: number): Promise<boolean> {
    // First, check if role has people assigned
    const usageCount = await this.getRoleUsageCount(id);
    
    if (usageCount > 0) {
      throw new Error('Cannot delete role with assigned people. Please reassign people first.');
    }
    
    const query = 'DELETE FROM roles WHERE id = ?';
    const result = await executeQuery(query, [id]) as DeleteResult;
    
    return result.affectedRows > 0;
  }

  // Search roles by name
  static async searchRoles(searchTerm: string): Promise<Role[]> {
    const query = 'SELECT * FROM roles WHERE name LIKE ? ORDER BY name';
    const searchPattern = `%${searchTerm}%`;
    const result = await executeQuery(query, [searchPattern]) as Role[];
    return result;
  }

  // Get roles with usage count
  static async getRolesWithUsageCount(): Promise<(Role & { usageCount: number })[]> {
    const query = `
      SELECT 
        r.id,
        r.name,
        COUNT(p.id) as usageCount
      FROM roles r
      LEFT JOIN people p ON r.id = p.role_id
      GROUP BY r.id, r.name
      ORDER BY r.name
    `;
    
    const result = await executeQuery(query) as (Role & { usageCount: number })[];
    return result;
  }

  // Get people by role
  static async getPeopleByRole(roleId: number): Promise<PersonWithTeamAndRole[]> {
    const query = `
      SELECT 
        p.*,
        t.name as team_name,
        r.name as role_name
      FROM people p
      LEFT JOIN teams t ON p.team_id = t.id
      LEFT JOIN roles r ON p.role_id = r.id
      WHERE p.role_id = ?
      ORDER BY p.name
    `;
    
    const result = await executeQuery(query, [roleId]) as PersonWithRoleRaw[];
    
    return result.map(person => ({
      id: person.id,
      name: person.name,
      seniority: person.seniority as 'JR I' | 'JR II' | 'SSR I' | 'SSR II' | 'SR I' | 'SR II' | null,
      role: person.role as 'Frontend' | 'Backend' | 'DevOps' | 'Mobile' | 'Arquitect' | 'TS' | 'TL' | 'QA' | 'UX' | 'SD' | 'PM' | 'SC' | 'TM' | 'Gerente Técnico' | 'Lider DevOps' | 'Lider PMO' | 'Lider QA' | 'Lider Soporte' | 'Lider UX' | 'BC' | 'PC' | 'Lider Consultoría' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
      team: person.team_name ? {
        id: person.team_id || 0,
        name: person.team_name,
      } : null,
      roleDetail: {
        id: person.role_id || 0,
        name: person.role_name,
      }
    }));
  }

  // Get role usage count
  static async getRoleUsageCount(id: number): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM people WHERE role_id = ?';
    const result = await executeQuery(query, [id]) as { count: number }[];
    return result[0].count;
  }

  // Check if role exists
  static async roleExists(id: number): Promise<boolean> {
    const query = 'SELECT COUNT(*) as count FROM roles WHERE id = ?';
    const result = await executeQuery(query, [id]) as { count: number }[];
    return result[0].count > 0;
  }

  // Check if role name is available
  static async isRoleNameAvailable(name: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM roles WHERE name = ?';
    const params: (string | number)[] = [name];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const result = await executeQuery(query, params) as { count: number }[];
    return result[0].count === 0;
  }
}
