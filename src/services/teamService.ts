import { executeQuery } from '@/lib/db';
import { Team, TeamWithMembers, PersonWithTeamAndRole } from '@/types/database';

interface MemberWithTeamAndRole {
  id: number;
  name: string;
  seniority: string | null;
  contract: string | null;
  team_id: number | null;
  role_id: number | null;
  team_name: string;
  role_name: string;
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

export class TeamService {
  // Get all teams
  static async getAllTeams(): Promise<Team[]> {
    const query = 'SELECT * FROM teams ORDER BY name';
    const result = await executeQuery(query);
    return result as Team[];
  }

  // Get team by ID
  static async getTeamById(id: number): Promise<Team | null> {
    const query = 'SELECT * FROM teams WHERE id = ?';
    const result = await executeQuery(query, [id]) as Team[];
    return result[0] || null;
  }

  // Get team with members
  static async getTeamWithMembers(id: number): Promise<TeamWithMembers | null> {
    const teamQuery = 'SELECT * FROM teams WHERE id = ?';
    const teamResult = await executeQuery(teamQuery, [id]) as Team[];
    
    if (!teamResult[0]) return null;
    
    const team = teamResult[0];
    
    const membersQuery = `
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
    
    const membersResult = await executeQuery(membersQuery, [id]) as MemberWithTeamAndRole[];
    
    const members: PersonWithTeamAndRole[] = membersResult.map(member => ({
      id: member.id,
      name: member.name,
      seniority: member.seniority as 'JR I' | 'JR II' | 'SSR I' | 'SSR II' | 'SR I' | 'SR II' | null,
      contract: member.contract as 'Employee' | 'Contractor' | null,
      team_id: member.team_id,
      role_id: member.role_id,
      team: {
        id: team.id,
        name: member.team_name,
      },
      roleDetail: member.role_name ? {
        id: member.role_id || 0,
        name: member.role_name,
      } : null
    }));

    return {
      ...team,
      members,
      memberCount: members.length,
    };
  }

  // Create new team
  static async createTeam(name: string): Promise<Team> {
    // Validate team name
    if (!name || name.trim().length === 0) {
      throw new Error('Team name is required');
    }
    
    // Check if team name is available
    const nameAvailable = await this.isTeamNameAvailable(name);
    if (!nameAvailable) {
      throw new Error('Team name already exists');
    }
    
    const query = 'INSERT INTO teams (name) VALUES (?)';
    const result = await executeQuery(query, [name.trim()]) as InsertResult;
    
    const newTeam = await this.getTeamById(result.insertId);
    if (!newTeam) {
      throw new Error('Failed to create team');
    }
    
    return newTeam;
  }

  // Update team
  static async updateTeam(id: number, name: string): Promise<Team | null> {
    // Validate team name
    if (!name || name.trim().length === 0) {
      throw new Error('Team name is required');
    }
    
    // Check if team exists
    const teamExists = await this.teamExists(id);
    if (!teamExists) {
      return null;
    }
    
    // Check if team name is available
    const nameAvailable = await this.isTeamNameAvailable(name, id);
    if (!nameAvailable) {
      throw new Error('Team name already exists');
    }
    
    const query = 'UPDATE teams SET name = ? WHERE id = ?';
    const result = await executeQuery(query, [name.trim(), id]) as UpdateResult;
    
    if (result.affectedRows === 0) {
      return null;
    }
    
    return this.getTeamById(id);
  }

  // Delete team
  static async deleteTeam(id: number): Promise<boolean> {
    // First, check if team has members
    const membersQuery = 'SELECT COUNT(*) as count FROM people WHERE team_id = ?';
    const membersResult = await executeQuery(membersQuery, [id]) as { count: number }[];
    
    if (membersResult[0].count > 0) {
      throw new Error('Cannot delete team with members. Please reassign members first.');
    }
    
    const query = 'DELETE FROM teams WHERE id = ?';
    const result = await executeQuery(query, [id]) as DeleteResult;
    
    return result.affectedRows > 0;
  }

  // Search teams by name
  static async searchTeams(searchTerm: string): Promise<Team[]> {
    const query = 'SELECT * FROM teams WHERE name LIKE ? ORDER BY name';
    const searchPattern = `%${searchTerm}%`;
    const result = await executeQuery(query, [searchPattern]) as Team[];
    return result;
  }

  // Get teams with member count
  static async getTeamsWithMemberCount(): Promise<(Team & { memberCount: number })[]> {
    const query = `
      SELECT 
        t.id,
        t.name,
        COUNT(p.id) as memberCount
      FROM teams t
      LEFT JOIN people p ON t.id = p.team_id
      GROUP BY t.id, t.name
      ORDER BY t.name
    `;
    
    const result = await executeQuery(query) as (Team & { memberCount: number })[];
    return result;
  }

  // Check if team exists
  static async teamExists(id: number): Promise<boolean> {
    const query = 'SELECT COUNT(*) as count FROM teams WHERE id = ?';
    const result = await executeQuery(query, [id]) as { count: number }[];
    return result[0].count > 0;
  }

  // Check if team name is available
  static async isTeamNameAvailable(name: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM teams WHERE name = ?';
    const params: (string | number)[] = [name];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const result = await executeQuery(query, params) as { count: number }[];
    return result[0].count === 0;
  }

  // Get team stats
  static async getTeamStats(id: number) {
    const query = `
      SELECT 
        COUNT(*) as total_members,
        COUNT(CASE WHEN seniority LIKE '%JR%' THEN 1 END) as junior_count,
        COUNT(CASE WHEN seniority LIKE '%SSR%' THEN 1 END) as mid_count,
        COUNT(CASE WHEN seniority LIKE '%SR%' THEN 1 END) as senior_count
      FROM people 
      WHERE team_id = ?
    `;
    
    const result = await executeQuery(query, [id]);
    return result;
  }
}
