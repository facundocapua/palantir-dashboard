'use server';

import { revalidatePath } from 'next/cache';
import { TeamService } from '@/services/teamService';
import { Team, TeamWithMembers, TeamWithMemberCount } from '@/types/database';

export async function getAllTeams(): Promise<Team[]> {
  try {
    return await TeamService.getAllTeams();
  } catch (error) {
    console.error('Error getting all teams:', error);
    throw new Error('Failed to get teams');
  }
}

export async function getTeamById(id: number): Promise<Team | null> {
  try {
    return await TeamService.getTeamById(id);
  } catch (error) {
    console.error('Error getting team by ID:', error);
    throw new Error('Failed to get team');
  }
}

export async function getTeamWithMembers(id: number): Promise<TeamWithMembers | null> {
  try {
    return await TeamService.getTeamWithMembers(id);
  } catch (error) {
    console.error('Error getting team with members:', error);
    throw new Error('Failed to get team with members');
  }
}

export async function getTeamsWithMemberCount(): Promise<TeamWithMemberCount[]> {
  try {
    return await TeamService.getTeamsWithMemberCount();
  } catch (error) {
    console.error('Error getting teams with member count:', error);
    throw new Error('Failed to get teams with member count');
  }
}

export async function createTeam(name: string): Promise<{ success: boolean; data?: Team; error?: string }> {
  try {
    const team = await TeamService.createTeam(name);
    revalidatePath('/teams');
    revalidatePath('/people');
    return { success: true, data: team };
  } catch (error) {
    console.error('Error creating team:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create team' 
    };
  }
}

export async function updateTeam(id: number, name: string): Promise<{ success: boolean; data?: Team; error?: string }> {
  try {
    const team = await TeamService.updateTeam(id, name);
    if (!team) {
      return { success: false, error: 'Team not found' };
    }
    revalidatePath('/teams');
    revalidatePath('/people');
    return { success: true, data: team };
  } catch (error) {
    console.error('Error updating team:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update team' 
    };
  }
}

export async function deleteTeam(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await TeamService.deleteTeam(id);
    if (!success) {
      return { success: false, error: 'Team not found' };
    }
    revalidatePath('/teams');
    revalidatePath('/people');
    return { success: true };
  } catch (error) {
    console.error('Error deleting team:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete team' 
    };
  }
}

export async function searchTeams(searchTerm: string): Promise<Team[]> {
  try {
    return await TeamService.searchTeams(searchTerm);
  } catch (error) {
    console.error('Error searching teams:', error);
    throw new Error('Failed to search teams');
  }
}

export async function getTeamStats(id: number) {
  try {
    return await TeamService.getTeamStats(id);
  } catch (error) {
    console.error('Error getting team stats:', error);
    throw new Error('Failed to get team stats');
  }
}

export async function isTeamNameAvailable(name: string, excludeId?: number): Promise<boolean> {
  try {
    return await TeamService.isTeamNameAvailable(name, excludeId);
  } catch (error) {
    console.error('Error checking team name availability:', error);
    throw new Error('Failed to check team name availability');
  }
}
