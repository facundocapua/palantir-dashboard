'use server';

import { PersonService } from '@/services/personService';
import { revalidatePath } from 'next/cache';

export async function updatePersonTeamAssignment(personId: number, teamId: number | null) {
  try {
    const updatedPerson = await PersonService.updatePerson(personId, { team_id: teamId });
    
    // Revalidate the team assignments page to show updated data
    revalidatePath('/team-assignments');
    
    return {
      success: true,
      data: updatedPerson
    };
  } catch (error) {
    console.error('Error updating person team assignment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update person'
    };
  }
}

export async function updateMultiplePersonTeamAssignments(updates: Array<{ personId: number; teamId: number | null }>) {
  try {
    const results = [];
    
    for (const update of updates) {
      const updatedPerson = await PersonService.updatePerson(update.personId, { team_id: update.teamId });
      results.push(updatedPerson);
    }
    
    // Revalidate the team assignments page to show updated data
    revalidatePath('/team-assignments');
    
    return {
      success: true,
      data: results
    };
  } catch (error) {
    console.error('Error updating multiple person team assignments:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update people'
    };
  }
}
