'use server';

import { GitHubStatisticsService } from '@/services/githubStatisticsService';
import { GitHubStatistic } from '@/types/database';

/**
 * Get GitHub statistics for a specific project
 */
export async function getProjectGitHubStatistics(projectId: number): Promise<GitHubStatistic[]> {
  try {
    return await GitHubStatisticsService.getProjectStatistics(projectId);
  } catch (error) {
    console.error('Error fetching project GitHub statistics:', error);
    throw new Error('Failed to fetch GitHub statistics');
  }
}

/**
 * Process GitHub statistics for all projects
 */
export async function processAllGitHubStatistics(): Promise<{ success: boolean; message: string }> {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    await GitHubStatisticsService.processAllProjectStatistics(githubToken);
    
    return {
      success: true,
      message: 'GitHub statistics processed successfully'
    };
  } catch (error) {
    console.error('Error processing GitHub statistics:', error);
    return {
      success: false,
      message: 'Failed to process GitHub statistics'
    };
  }
}

/**
 * Process GitHub statistics for a specific project
 */
export async function processProjectGitHubStatistics(
  projectId: number,
  repository: string
): Promise<{ success: boolean; message: string; statistics: GitHubStatistic[] }> {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const statistics = await GitHubStatisticsService.processProjectStatistics(
      projectId,
      repository,
      githubToken
    );
    
    return {
      success: true,
      message: `Processed ${statistics.length} new statistics`,
      statistics
    };
  } catch (error) {
    console.error('Error processing project GitHub statistics:', error);
    return {
      success: false,
      message: 'Failed to process project GitHub statistics',
      statistics: []
    };
  }
}
