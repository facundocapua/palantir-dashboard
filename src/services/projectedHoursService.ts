import { db } from '@/lib/db';
import { ProjectProjectedHours, TeamCapacityAnalysis, ProjectWithProjectedHours } from '@/types/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class ProjectedHoursService {
  
  static async getProjectedHoursByProject(projectId: number): Promise<ProjectProjectedHours[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM project_projected_hours WHERE project_id = ? ORDER BY year DESC, month DESC',
      [projectId]
    );
    
    return rows.map(row => ({
      id: row.id,
      project_id: row.project_id,
      year: row.year,
      month: row.month,
      projected_hours: row.projected_hours,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    }));
  }

  static async getProjectedHoursByMonth(year: number, month: number): Promise<ProjectProjectedHours[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM project_projected_hours WHERE year = ? AND month = ? ORDER BY project_id',
      [year, month]
    );
    
    return rows.map(row => ({
      id: row.id,
      project_id: row.project_id,
      year: row.year,
      month: row.month,
      projected_hours: row.projected_hours,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    }));
  }

  static async getProjectedHoursByYear(year: number): Promise<ProjectProjectedHours[]> {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM project_projected_hours WHERE year = ? ORDER BY project_id, month',
      [year]
    );
    
    return rows.map(row => ({
      id: row.id,
      project_id: row.project_id,
      year: row.year,
      month: row.month,
      projected_hours: row.projected_hours,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    }));
  }

  static async upsertProjectedHours(
    projectId: number, 
    year: number, 
    month: number, 
    projectedHours: number
  ): Promise<ProjectProjectedHours> {
    await db.execute<ResultSetHeader>(
      `INSERT INTO project_projected_hours (project_id, year, month, projected_hours) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       projected_hours = VALUES(projected_hours),
       updated_at = CURRENT_TIMESTAMP`,
      [projectId, year, month, projectedHours]
    );

    // Get the updated/created record
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM project_projected_hours WHERE project_id = ? AND year = ? AND month = ?',
      [projectId, year, month]
    );

    const row = rows[0];
    return {
      id: row.id,
      project_id: row.project_id,
      year: row.year,
      month: row.month,
      projected_hours: row.projected_hours,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }

  static async deleteProjectedHours(id: number): Promise<void> {
    await db.execute('DELETE FROM project_projected_hours WHERE id = ?', [id]);
  }

  static async getTeamCapacityAnalysis(year: number, month: number): Promise<TeamCapacityAnalysis[]> {
    // Get teams with their total member hours
    const [teamRows] = await db.execute<RowDataPacket[]>(
      `SELECT 
        t.id,
        t.name,
        COUNT(p.id) as member_count,
        COALESCE(SUM(p.monthly_hours), 0) as total_member_hours
       FROM teams t
       LEFT JOIN people p ON t.id = p.team_id
       GROUP BY t.id, t.name
       ORDER BY t.name`
    );

    const result: TeamCapacityAnalysis[] = [];

    for (const teamRow of teamRows) {
      // Get projects for this team with their projected hours for the specified month
      const [projectRows] = await db.execute<RowDataPacket[]>(
        `SELECT 
          proj.id,
          proj.name,
          proj.description,
          proj.client_id,
          proj.team_id,
          proj.status,
          proj.start_date,
          proj.end_date,
          proj.created_at,
          proj.updated_at,
          c.name as client_name,
          t.name as team_name,
          COALESCE(pph.projected_hours, 0) as projected_hours
         FROM projects proj
         JOIN clients c ON proj.client_id = c.id
         JOIN teams t ON proj.team_id = t.id
         LEFT JOIN project_projected_hours pph ON proj.id = pph.project_id 
           AND pph.year = ? AND pph.month = ?
         WHERE proj.team_id = ? AND proj.status IN ('Active', 'On Hold')
         ORDER BY proj.name`,
        [year, month, teamRow.id]
      );

      const projects: ProjectWithProjectedHours[] = projectRows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        client_id: row.client_id,
        team_id: row.team_id,
        status: row.status,
        start_date: row.start_date ? new Date(row.start_date) : null,
        end_date: row.end_date ? new Date(row.end_date) : null,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
        client: { id: row.client_id, name: row.client_name, created_at: new Date(), updated_at: new Date() },
        team: { id: teamRow.id, name: teamRow.name },
        projectedHours: row.projected_hours > 0 ? [{
          id: 0,
          project_id: row.id,
          year,
          month,
          projected_hours: row.projected_hours,
          created_at: new Date(),
          updated_at: new Date()
        }] : []
      }));

      const totalProjectedHours = projects.reduce((sum, project) => 
        sum + (project.projectedHours[0]?.projected_hours || 0), 0
      );

      const totalMemberHours = teamRow.total_member_hours || 0;
      const capacityDifference = totalMemberHours - totalProjectedHours;
      const utilizationPercentage = totalMemberHours > 0 
        ? Math.round((totalProjectedHours / totalMemberHours) * 100) 
        : 0;

      result.push({
        team: { id: teamRow.id, name: teamRow.name },
        totalMemberHours,
        memberCount: teamRow.member_count || 0,
        projects,
        totalProjectedHours,
        capacityDifference,
        utilizationPercentage
      });
    }

    return result;
  }

  static async bulkUpsertProjectedHours(updates: Array<{
    projectId: number;
    year: number;
    month: number;
    projectedHours: number;
  }>): Promise<void> {
    if (updates.length === 0) return;

    const values = updates.map(update => 
      `(${update.projectId}, ${update.year}, ${update.month}, ${update.projectedHours})`
    ).join(', ');

    await db.execute(
      `INSERT INTO project_projected_hours (project_id, year, month, projected_hours) 
       VALUES ${values}
       ON DUPLICATE KEY UPDATE 
       projected_hours = VALUES(projected_hours),
       updated_at = CURRENT_TIMESTAMP`
    );
  }
}
