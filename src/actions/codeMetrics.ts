'use server';

import { CodeMetricsService, CodeReportData, WeeklyCodeMetrics, ProjectCodeMetrics } from '@/services/codeMetricsService';

/**
 * Get complete code metrics report data
 */
export async function getCodeReportData(): Promise<{ success: boolean; data?: CodeReportData; error?: string }> {
  try {
    const data = await CodeMetricsService.getCodeReportData();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching code report data:', error);
    return { 
      success: false, 
      error: 'Failed to fetch code metrics data',
      data: {
        weeklyMetrics: [],
        projectMetrics: [],
        totalStats: {
          total_additions: 0,
          total_deletions: 0,
          net_lines: 0,
          projects_tracked: 0,
          weeks_tracked: 0
        }
      }
    };
  }
}

/**
 * Get weekly code metrics
 */
export async function getWeeklyCodeMetrics(): Promise<{ success: boolean; data: WeeklyCodeMetrics[]; error?: string }> {
  try {
    const data = await CodeMetricsService.getWeeklyCodeMetrics();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching weekly code metrics:', error);
    return { success: false, data: [], error: 'Failed to fetch weekly metrics' };
  }
}

/**
 * Get project code metrics
 */
export async function getProjectCodeMetrics(): Promise<{ success: boolean; data: ProjectCodeMetrics[]; error?: string }> {
  try {
    const data = await CodeMetricsService.getProjectCodeMetrics();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching project code metrics:', error);
    return { success: false, data: [], error: 'Failed to fetch project metrics' };
  }
}

/**
 * Get weekly metrics for a specific project
 */
export async function getProjectWeeklyMetrics(projectId: number): Promise<{ success: boolean; data: WeeklyCodeMetrics[]; error?: string }> {
  try {
    const data = await CodeMetricsService.getProjectWeeklyMetrics(projectId);
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching project weekly metrics:', error);
    return { success: false, data: [], error: 'Failed to fetch project weekly metrics' };
  }
}
