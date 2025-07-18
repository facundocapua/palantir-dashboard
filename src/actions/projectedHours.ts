'use server';

import { ProjectedHoursService } from '@/services/projectedHoursService';
import { revalidatePath } from 'next/cache';

export async function updateProjectedHours(
  projectId: number,
  year: number,
  month: number,
  projectedHours: number
) {
  try {
    const result = await ProjectedHoursService.upsertProjectedHours(
      projectId,
      year,
      month,
      projectedHours
    );
    
    revalidatePath('/projected-hours');
    revalidatePath('/capacity-analysis');
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error updating projected hours:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update projected hours'
    };
  }
}

export async function bulkUpdateProjectedHours(updates: Array<{
  projectId: number;
  year: number;
  month: number;
  projectedHours: number;
}>) {
  try {
    await ProjectedHoursService.bulkUpsertProjectedHours(updates);
    
    revalidatePath('/projected-hours');
    revalidatePath('/capacity-analysis');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error bulk updating projected hours:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update projected hours'
    };
  }
}

export async function deleteProjectedHours(id: number) {
  try {
    await ProjectedHoursService.deleteProjectedHours(id);
    
    revalidatePath('/projected-hours');
    revalidatePath('/capacity-analysis');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting projected hours:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete projected hours'
    };
  }
}

export async function getTeamCapacityAnalysis(year: number, month: number) {
  try {
    const analysis = await ProjectedHoursService.getTeamCapacityAnalysis(year, month);
    
    return {
      success: true,
      data: analysis
    };
  } catch (error) {
    console.error('Error getting team capacity analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get capacity analysis'
    };
  }
}
