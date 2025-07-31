import mysql from 'mysql2/promise';
import { GitHubStatistic } from '@/types/database';
import { db } from '@/lib/db';

export interface GitHubWeeklyStats {
  week: number; // Unix timestamp of the start of the week
  additions: number; // Total additions for the week
  deletions: number; // Total deletions for the week (positive number)
}

export interface GitHubStatsResponse {
  week_date: Date;
  additions: number;
  deletions: number;
}

export class GitHubStatisticsService {
  /**
   * Fetch weekly code frequency from GitHub API with retry logic for 202 responses
   */
  static async fetchWeeklyStats(owner: string, repo: string, githubToken?: string): Promise<GitHubWeeklyStats[]> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Palantir-Dashboard'
    };

    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    const maxRetries = 10;
    const retryDelay = 5000; // 5 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Fetching GitHub stats for ${owner}/${repo} (attempt ${attempt}/${maxRetries})`);
        
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`, {
          headers
        });

        if (response.status === 202) {
          console.log(`Repository statistics are being computed (202 response). Waiting ${retryDelay/1000} seconds before retry...`);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          } else {
            console.error(`Max retries reached for ${owner}/${repo}. Repository statistics are still being computed.`);
            return [];
          }
        }

        if (!response.ok) {
          if (response.status === 404) {
            console.error(`Repository ${owner}/${repo} not found or not accessible`);
            return [];
          }
          if (response.status === 422) {
            console.error(`Repository ${owner}/${repo} contains more than 1000 commits, skipping`);
            return [];
          }
          // Handle other errors
          console.error(`GitHub API error: ${response.status} ${response.statusText}`);
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const data: number[][] = await response.json();
        
        if (!Array.isArray(data)) {
          console.error(`Unexpected response format for ${owner}/${repo}`);
          return [];
        }

        // Transform the response data into our format
        const weeklyStats: GitHubWeeklyStats[] = data
          .filter(week => Array.isArray(week) && week.length === 3)
          .map(week => ({
            week: week[0], // Unix timestamp
            additions: week[1], // Additions (positive number)
            deletions: Math.abs(week[2]) // Deletions (convert to positive number)
          }))
          .filter(week => week.additions > 0 || week.deletions > 0); // Only include weeks with activity

        console.log(`Successfully fetched ${weeklyStats.length} weeks of activity for ${owner}/${repo}`);
        return weeklyStats;
        
      } catch (error) {
        console.error(`Error fetching GitHub stats for ${owner}/${repo} (attempt ${attempt}):`, error);
        if (attempt === maxRetries) {
          return [];
        }
        // Wait before retrying on error
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    return [];
  }

  /**
   * Parse repository URL to extract owner and repo name
   */
  static parseRepositoryUrl(repository: string): { owner: string; repo: string } | null {
    try {
      // Handle various GitHub URL formats
      const patterns = [
        /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/.*)?$/,
        /^([^\/]+)\/([^\/]+)$/ // owner/repo format
      ];

      let cleanUrl = repository;
      if (repository.startsWith('http')) {
        cleanUrl = new URL(repository).pathname.slice(1);
      }

      for (const pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match) {
          return {
            owner: match[1],
            repo: match[2]
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error parsing repository URL:', error);
      return null;
    }
  }

  /**
   * Convert Unix timestamp to MySQL-compatible date (Monday of the week)
   */
  static timestampToWeekDate(timestamp: number): Date {
    const date = new Date(timestamp * 1000);
    const dayOfWeek = date.getDay();
    const daysToMonday = (dayOfWeek + 6) % 7; // Calculate days to subtract to get to Monday
    const monday = new Date(date);
    monday.setDate(date.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  /**
   * Get existing GitHub statistics for a project
   */
  static async getProjectStatistics(projectId: number): Promise<GitHubStatistic[]> {
    try {
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM github_statistics WHERE project_id = ? ORDER BY week_date DESC',
        [projectId]
      );

      return rows.map((row: mysql.RowDataPacket) => ({
        id: row.id,
        project_id: row.project_id,
        week_date: row.week_date,
        additions: row.additions,
        deletions: row.deletions,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching project statistics:', error);
      throw error;
    }
  }

  /**
   * Check if statistics exist for a specific project and week
   */
  static async statisticsExist(projectId: number, weekDate: Date): Promise<boolean> {
    try {
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM github_statistics WHERE project_id = ? AND week_date = ?',
        [projectId, weekDate.toISOString().split('T')[0]]
      );

      return rows[0].count > 0;
    } catch (error) {
      console.error('Error checking if statistics exist:', error);
      throw error;
    }
  }

  /**
   * Insert new GitHub statistics (only if they don't exist)
   */
  static async insertStatistics(
    projectId: number,
    weekDate: Date,
    additions: number,
    deletions: number
  ): Promise<GitHubStatistic | null> {
    try {
      // Check if statistics already exist for this project and week
      const exists = await this.statisticsExist(projectId, weekDate);
      if (exists) {
        console.log(`Statistics already exist for project ${projectId} and week ${weekDate.toISOString().split('T')[0]}`);
        return null;
      }

      const [result] = await db.execute<mysql.ResultSetHeader>(
        'INSERT INTO github_statistics (project_id, week_date, additions, deletions) VALUES (?, ?, ?, ?)',
        [projectId, weekDate.toISOString().split('T')[0], additions, deletions]
      );

      // Fetch the inserted record
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        'SELECT * FROM github_statistics WHERE id = ?',
        [result.insertId]
      );

      if (rows.length === 0) {
        throw new Error('Failed to fetch inserted statistics');
      }

      const row = rows[0];
      return {
        id: row.id,
        project_id: row.project_id,
        week_date: row.week_date,
        additions: row.additions,
        deletions: row.deletions,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    } catch (error) {
      console.error('Error inserting GitHub statistics:', error);
      throw error;
    }
  }

  /**
   * Process GitHub statistics for a single project
   */
  static async processProjectStatistics(
    projectId: number,
    repository: string,
    githubToken?: string
  ): Promise<GitHubStatistic[]> {
    const repoInfo = this.parseRepositoryUrl(repository);
    if (!repoInfo) {
      console.error(`Invalid repository URL: ${repository}`);
      return [];
    }

    const weeklyStats = await this.fetchWeeklyStats(repoInfo.owner, repoInfo.repo, githubToken);
    const insertedStats: GitHubStatistic[] = [];

    for (const week of weeklyStats) {
      // Skip weeks with no activity
      if (week.additions === 0 && week.deletions === 0) {
        continue;
      }

      const weekDate = this.timestampToWeekDate(week.week);
      
      // Use the actual additions and deletions from GitHub API
      const additions = week.additions;
      const deletions = week.deletions;

      try {
        const stat = await this.insertStatistics(projectId, weekDate, additions, deletions);
        if (stat) {
          insertedStats.push(stat);
          console.log(`Inserted statistics for project ${projectId}, week ${weekDate.toISOString().split('T')[0]}: +${additions} -${deletions}`);
        }
      } catch (error) {
        console.error(`Error processing statistics for project ${projectId}, week ${weekDate}:`, error);
      }
    }

    return insertedStats;
  }

  /**
   * Get all projects with repositories for statistics processing
   */
  static async getProjectsWithRepositories(): Promise<Array<{ id: number; name: string; repository: string }>> {
    try {
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        'SELECT id, name, repository FROM projects WHERE repository IS NOT NULL AND repository != ""'
      );

      return rows.map((row: mysql.RowDataPacket) => ({
        id: row.id,
        name: row.name,
        repository: row.repository
      }));
    } catch (error) {
      console.error('Error fetching projects with repositories:', error);
      throw error;
    }
  }

  /**
   * Process statistics for all projects with repositories
   */
  static async processAllProjectStatistics(githubToken?: string): Promise<void> {
    console.log('Starting GitHub statistics processing for all projects...');
    
    const projects = await this.getProjectsWithRepositories();
    console.log(`Found ${projects.length} projects with repositories`);

    for (const project of projects) {
      console.log(`Processing statistics for project: ${project.name} (${project.repository})`);
      
      try {
        const stats = await this.processProjectStatistics(project.id, project.repository, githubToken);
        console.log(`Inserted ${stats.length} new statistics for project ${project.name}`);
      } catch (error) {
        console.error(`Error processing project ${project.name}:`, error);
      }
    }

    console.log('GitHub statistics processing completed');
  }
}
