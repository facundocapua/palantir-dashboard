import { executeQuery } from '@/lib/db';
import { Project, ProjectWithClientAndTeam } from '@/types/database';

interface ProjectWithClientAndTeamRaw {
  id: number;
  name: string;
  description: string | null;
  repository: string | null;
  client_id: number;
  team_id: number;
  status: 'Active' | 'Inactive' | 'Completed' | 'On Hold';
  start_date: Date | null;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
  client_name: string;
  client_created_at: Date;
  client_updated_at: Date;
  team_name: string;
}

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

export class ProjectService {
  // Get all projects
  static async getAllProjects(): Promise<Project[]> {
    const query = 'SELECT * FROM projects ORDER BY name ASC';
    const results = await executeQuery(query) as Project[];
    return results;
  }

  // Get all projects with client and team details
  static async getAllProjectsWithDetails(): Promise<ProjectWithClientAndTeam[]> {
    const query = `
      SELECT 
        p.*,
        c.name as client_name,
        c.created_at as client_created_at,
        c.updated_at as client_updated_at,
        t.name as team_name
      FROM projects p
      INNER JOIN clients c ON p.client_id = c.id
      INNER JOIN teams t ON p.team_id = t.id
      ORDER BY p.name ASC
    `;
    const results = await executeQuery(query) as ProjectWithClientAndTeamRaw[];
    
    return results.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      repository: row.repository,
      client_id: row.client_id,
      team_id: row.team_id,
      status: row.status,
      start_date: row.start_date,
      end_date: row.end_date,
      created_at: row.created_at,
      updated_at: row.updated_at,
      client: {
        id: row.client_id,
        name: row.client_name,
        created_at: row.client_created_at,
        updated_at: row.client_updated_at,
      },
      team: {
        id: row.team_id,
        name: row.team_name,
      },
    }));
  }

  // Get project by ID
  static async getProjectById(id: number): Promise<Project | null> {
    const query = 'SELECT * FROM projects WHERE id = ?';
    const results = await executeQuery(query, [id]) as Project[];
    return results.length > 0 ? results[0] : null;
  }

  // Get project by ID with details
  static async getProjectByIdWithDetails(id: number): Promise<ProjectWithClientAndTeam | null> {
    const query = `
      SELECT 
        p.*,
        c.name as client_name,
        c.created_at as client_created_at,
        c.updated_at as client_updated_at,
        t.name as team_name
      FROM projects p
      INNER JOIN clients c ON p.client_id = c.id
      INNER JOIN teams t ON p.team_id = t.id
      WHERE p.id = ?
    `;
    const results = await executeQuery(query, [id]) as ProjectWithClientAndTeamRaw[];
    
    if (results.length === 0) return null;
    
    const row = results[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      repository: row.repository,
      client_id: row.client_id,
      team_id: row.team_id,
      status: row.status,
      start_date: row.start_date,
      end_date: row.end_date,
      created_at: row.created_at,
      updated_at: row.updated_at,
      client: {
        id: row.client_id,
        name: row.client_name,
        created_at: row.client_created_at,
        updated_at: row.client_updated_at,
      },
      team: {
        id: row.team_id,
        name: row.team_name,
      },
    };
  }

  // Get projects by client ID
  static async getProjectsByClientId(clientId: number): Promise<Project[]> {
    const query = 'SELECT * FROM projects WHERE client_id = ? ORDER BY name ASC';
    const results = await executeQuery(query, [clientId]) as Project[];
    return results;
  }

  // Get projects by team ID
  static async getProjectsByTeamId(teamId: number): Promise<Project[]> {
    const query = 'SELECT * FROM projects WHERE team_id = ? ORDER BY name ASC';
    const results = await executeQuery(query, [teamId]) as Project[];
    return results;
  }

  // Create new project
  static async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const query = `
      INSERT INTO projects (name, description, repository, client_id, team_id, status, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [
      projectData.name,
      projectData.description,
      projectData.repository,
      projectData.client_id,
      projectData.team_id,
      projectData.status,
      projectData.start_date,
      projectData.end_date
    ]) as InsertResult;
    
    return result.insertId;
  }

  // Update project
  static async updateProject(id: number, projectData: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (projectData.name !== undefined) {
      fields.push('name = ?');
      values.push(projectData.name);
    }
    if (projectData.description !== undefined) {
      fields.push('description = ?');
      values.push(projectData.description);
    }
    if (projectData.repository !== undefined) {
      fields.push('repository = ?');
      values.push(projectData.repository);
    }
    if (projectData.client_id !== undefined) {
      fields.push('client_id = ?');
      values.push(projectData.client_id);
    }
    if (projectData.team_id !== undefined) {
      fields.push('team_id = ?');
      values.push(projectData.team_id);
    }
    if (projectData.status !== undefined) {
      fields.push('status = ?');
      values.push(projectData.status);
    }
    if (projectData.start_date !== undefined) {
      fields.push('start_date = ?');
      values.push(projectData.start_date);
    }
    if (projectData.end_date !== undefined) {
      fields.push('end_date = ?');
      values.push(projectData.end_date);
    }

    if (fields.length === 0) {
      return false;
    }

    const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const result = await executeQuery(query, values) as UpdateResult;
    return result.affectedRows > 0;
  }

  // Delete project
  static async deleteProject(id: number): Promise<boolean> {
    const query = 'DELETE FROM projects WHERE id = ?';
    const result = await executeQuery(query, [id]) as DeleteResult;
    return result.affectedRows > 0;
  }

  // Search projects by name
  static async searchProjectsByName(searchTerm: string): Promise<ProjectWithClientAndTeam[]> {
    const query = `
      SELECT 
        p.*,
        c.name as client_name,
        c.created_at as client_created_at,
        c.updated_at as client_updated_at,
        t.name as team_name
      FROM projects p
      INNER JOIN clients c ON p.client_id = c.id
      INNER JOIN teams t ON p.team_id = t.id
      WHERE p.name LIKE ?
      ORDER BY p.name ASC
    `;
    const results = await executeQuery(query, [`%${searchTerm}%`]) as ProjectWithClientAndTeamRaw[];
    
    return results.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      repository: row.repository,
      client_id: row.client_id,
      team_id: row.team_id,
      status: row.status,
      start_date: row.start_date,
      end_date: row.end_date,
      created_at: row.created_at,
      updated_at: row.updated_at,
      client: {
        id: row.client_id,
        name: row.client_name,
        created_at: row.client_created_at,
        updated_at: row.client_updated_at,
      },
      team: {
        id: row.team_id,
        name: row.team_name,
      },
    }));
  }

  // Get project statistics
  static async getProjectStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    onHold: number;
    inactive: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'On Hold' THEN 1 ELSE 0 END) as onHold,
        SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive
      FROM projects
    `;
    const results = await executeQuery(query) as [{
      total: number;
      active: number;
      completed: number;
      onHold: number;
      inactive: number;
    }];
    
    return results[0];
  }
}
