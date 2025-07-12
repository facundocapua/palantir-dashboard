import { executeQuery } from '@/lib/db';
import { PersonWithTeamAndRole } from '@/types/database';

interface PersonWithTeamAndRoleRaw {
  id: number;
  name: string;
  seniority: string | null;
  role: string | null;
  contract: string | null;
  team_id: number | null;
  role_id: number | null;
  team_name: string | null;
  role_name: string | null;
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
      role: person.role as 'Frontend' | 'Backend' | 'DevOps' | 'Mobile' | 'Arquitect' | 'TS' | 'TL' | 'QA' | 'UX' | 'SD' | 'PM' | 'SC' | 'TM' | 'Gerente Técnico' | 'Lider DevOps' | 'Lider PMO' | 'Lider QA' | 'Lider Soporte' | 'Lider UX' | 'BC' | 'PC' | 'Lider Consultoría' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
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
      role: person.role as 'Frontend' | 'Backend' | 'DevOps' | 'Mobile' | 'Arquitect' | 'TS' | 'TL' | 'QA' | 'UX' | 'SD' | 'PM' | 'SC' | 'TM' | 'Gerente Técnico' | 'Lider DevOps' | 'Lider PMO' | 'Lider QA' | 'Lider Soporte' | 'Lider UX' | 'BC' | 'PC' | 'Lider Consultoría' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
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
      role: person.role as 'Frontend' | 'Backend' | 'DevOps' | 'Mobile' | 'Arquitect' | 'TS' | 'TL' | 'QA' | 'UX' | 'SD' | 'PM' | 'SC' | 'TM' | 'Gerente Técnico' | 'Lider DevOps' | 'Lider PMO' | 'Lider QA' | 'Lider Soporte' | 'Lider UX' | 'BC' | 'PC' | 'Lider Consultoría' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
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
      role: person.role as 'Frontend' | 'Backend' | 'DevOps' | 'Mobile' | 'Arquitect' | 'TS' | 'TL' | 'QA' | 'UX' | 'SD' | 'PM' | 'SC' | 'TM' | 'Gerente Técnico' | 'Lider DevOps' | 'Lider PMO' | 'Lider QA' | 'Lider Soporte' | 'Lider UX' | 'BC' | 'PC' | 'Lider Consultoría' | null,
      contract: person.contract as 'Employee' | 'Contractor' | null,
      team_id: person.team_id,
      role_id: person.role_id,
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
}
