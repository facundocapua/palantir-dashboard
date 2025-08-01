import { executeQuery } from '@/lib/db';
import mysql from 'mysql2/promise';

export interface WeeklyCodeMetrics {
  week_date: string;
  total_additions: number;
  total_deletions: number;
  total_changes: number;
}

export interface ProjectCodeMetrics {
  project_id: number;
  project_name: string;
  repository: string | null;
  total_additions: number;
  total_deletions: number;
  total_changes: number;
  weeks_tracked: number;
}

export interface CodeReportData {
  weeklyMetrics: WeeklyCodeMetrics[];
  projectMetrics: ProjectCodeMetrics[];
  totalStats: {
    total_additions: number;
    total_deletions: number;
    total_changes: number;
    projects_tracked: number;
    weeks_with_data: number;
  };
}

export class CodeMetricsService {
  /**
   * Get weekly code metrics over time
   */
  static async getWeeklyCodeMetrics(weeks: number = 12): Promise<WeeklyCodeMetrics[]> {
    try {
      const query = `
        SELECT 
          gs.week_date,
          SUM(gs.additions) as total_additions,
          SUM(gs.deletions) as total_deletions,
          SUM(gs.additions + gs.deletions) as total_changes,
          COUNT(DISTINCT gs.project_id) as projects_count
        FROM github_statistics gs
        WHERE gs.week_date >= DATE_SUB(NOW(), INTERVAL ? WEEK)
        GROUP BY gs.week_date
        ORDER BY gs.week_date ASC
      `;
      
      const rows = await executeQuery(query, [weeks]) as mysql.RowDataPacket[];
      
      return rows.map((row: mysql.RowDataPacket) => ({
        week_date: row.week_date,
        total_additions: row.total_additions || 0,
        total_deletions: row.total_deletions || 0,
        total_changes: row.total_changes || 0,
        projects_count: row.projects_count || 0
      }));
    } catch (error) {
      console.error('Error fetching weekly code metrics:', error);
      throw error;
    }
  }

  /**
   * Get code metrics by project
   */
  static async getProjectCodeMetrics(): Promise<ProjectCodeMetrics[]> {
    try {
      const query = `
        SELECT 
          p.id as project_id,
          p.name as project_name,
          p.repository,
          COALESCE(SUM(gs.additions), 0) as total_additions,
          COALESCE(SUM(gs.deletions), 0) as total_deletions,
          COALESCE(SUM(gs.additions + gs.deletions), 0) as total_changes,
          COUNT(gs.id) as weeks_tracked
        FROM projects p
        LEFT JOIN github_statistics gs ON p.id = gs.project_id
        WHERE p.repository IS NOT NULL AND p.repository != ''
        GROUP BY p.id, p.name, p.repository
        ORDER BY total_additions DESC
      `;
      
      const rows = await executeQuery(query) as mysql.RowDataPacket[];
      
      return rows.map((row: mysql.RowDataPacket) => ({
        project_id: row.project_id,
        project_name: row.project_name,
        repository: row.repository,
        total_additions: row.total_additions || 0,
        total_deletions: row.total_deletions || 0,
        total_changes: row.total_changes || 0,
        weeks_tracked: row.weeks_tracked || 0
      }));
    } catch (error) {
      console.error('Error fetching project code metrics:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive code report data
   */
  static async getCodeReportData(): Promise<{
    weeklyMetrics: WeeklyCodeMetrics[];
    projectMetrics: ProjectCodeMetrics[];
    totalStats: {
      total_additions: number;
      total_deletions: number;
      total_changes: number;
      projects_tracked: number;
      weeks_with_data: number;
    };
  }> {
    try {
      const [weeklyMetrics, projectMetrics] = await Promise.all([
        this.getWeeklyCodeMetrics(12),
        this.getProjectCodeMetrics()
      ]);

      // Calculate total stats
      const totalStatsQuery = `
        SELECT 
          COALESCE(SUM(additions), 0) as total_additions,
          COALESCE(SUM(deletions), 0) as total_deletions,
          COALESCE(SUM(additions + deletions), 0) as total_changes,
          COUNT(DISTINCT project_id) as projects_tracked,
          COUNT(DISTINCT week_date) as weeks_with_data
        FROM github_statistics
      `;
      
      const statsRows = await executeQuery(totalStatsQuery) as mysql.RowDataPacket[];
      const statsRow = statsRows[0] || {
        total_additions: 0,
        total_deletions: 0,
        total_changes: 0,
        projects_tracked: 0,
        weeks_with_data: 0
      };

      const totalStats = {
        total_additions: statsRow.total_additions || 0,
        total_deletions: statsRow.total_deletions || 0,
        total_changes: statsRow.total_changes || 0,
        projects_tracked: statsRow.projects_tracked || 0,
        weeks_with_data: statsRow.weeks_with_data || 0
      };

      return {
        weeklyMetrics,
        projectMetrics,
        totalStats
      };
    } catch (error) {
      console.error('Error fetching code report data:', error);
      throw error;
    }
  }

  /**
   * Get weekly metrics for a specific project
   */
  static async getProjectWeeklyMetrics(projectId: number): Promise<WeeklyCodeMetrics[]> {
    try {
      const query = `
        SELECT 
          DATE_FORMAT(week_date, '%Y-%m-%d') as week_date,
          additions as total_additions,
          deletions as total_deletions,
          (additions - deletions) as net_lines
        FROM github_statistics 
        WHERE project_id = ?
        ORDER BY week_date ASC
      `;
      
      const [rows] = await executeQuery(query, [projectId]) as mysql.RowDataPacket[];
      
      return rows.map((row: mysql.RowDataPacket) => ({
        week_date: row.week_date,
        total_additions: row.total_additions || 0,
        total_deletions: row.total_deletions || 0,
        net_lines: row.net_lines || 0
      }));
    } catch (error) {
      console.error('Error fetching project weekly metrics:', error);
      throw error;
    }
  }
}
