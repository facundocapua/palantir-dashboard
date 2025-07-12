import { executeQuery } from '@/lib/db';
import { Role } from '@/types/database';

export class RoleService {
  // Get all roles
  static async getAllRoles(): Promise<Role[]> {
    const query = 'SELECT * FROM roles ORDER BY name';
    const result = await executeQuery(query);
    return result as Role[];
  }

  // Get role by ID
  static async getRoleById(id: number): Promise<Role | null> {
    const query = 'SELECT * FROM roles WHERE id = ?';
    const result = await executeQuery(query, [id]) as Role[];
    return result[0] || null;
  }

  // Get role usage count
  static async getRoleUsageCount(id: number): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM people WHERE role_id = ?';
    const result = await executeQuery(query, [id]) as { count: number }[];
    return result[0].count;
  }
}
