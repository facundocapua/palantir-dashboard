import { executeQuery } from '@/lib/db';
import { Team, TeamWithMembers, PersonWithTeamAndRole } from '@/types/database';

interface MemberWithTeamAndRole {
  id: number;
  name: string;
  seniority: string | null;
  role: string | null;
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
      role: member.role as 'Frontend' | 'Backend' | 'DevOps' | 'Mobile' | 'Arquitect' | 'TS' | 'TL' | 'QA' | 'UX' | 'SD' | 'PM' | 'SC' | 'TM' | 'Gerente Técnico' | 'Lider DevOps' | 'Lider PMO' | 'Lider QA' | 'Lider Soporte' | 'Lider UX' | 'BC' | 'PC' | 'Lider Consultoría' | null,
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
    const query = 'INSERT INTO teams (name) VALUES (?)';
    const result = await executeQuery(query, [name]);
    const insertResult = result as InsertResult;
    
    return this.getTeamById(insertResult.insertId) as Promise<Team>;
  }

  // Update team
  static async updateTeam(id: number, name: string): Promise<Team | null> {
    const query = 'UPDATE teams SET name = ? WHERE id = ?';
    await executeQuery(query, [name, id]);
    
    return this.getTeamById(id);
  }

  // Delete team
  static async deleteTeam(id: number): Promise<boolean> {
    const query = 'DELETE FROM teams WHERE id = ?';
    const result = await executeQuery(query, [id]);
    const deleteResult = result as DeleteResult;
    
    return deleteResult.affectedRows > 0;
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
