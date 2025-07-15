'use server';

import { ReportsService, ReportFilters } from '@/services/reportsService';

export async function getFilteredReports(filters: ReportFilters = {}) {
  try {
    const stats = await ReportsService.getTeamStats(filters);
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching filtered reports:', error);
    return { 
      success: false, 
      error: 'Failed to fetch filtered reports',
      data: {
        roleStats: [],
        seniorityStats: [],
        teamStats: [],
        totalPeople: 0
      }
    };
  }
}
