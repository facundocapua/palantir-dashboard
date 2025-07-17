'use server';

import { revalidatePath } from 'next/cache';
import { ProjectService } from '@/services/projectService';
import { Project, ProjectWithClientAndTeam } from '@/types/database';

export async function getAllProjects(): Promise<Project[]> {
  try {
    return await ProjectService.getAllProjects();
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw new Error('Failed to get projects');
  }
}

export async function getAllProjectsWithDetails(): Promise<ProjectWithClientAndTeam[]> {
  try {
    return await ProjectService.getAllProjectsWithDetails();
  } catch (error) {
    console.error('Error getting projects with details:', error);
    throw new Error('Failed to get projects with details');
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  try {
    return await ProjectService.getProjectById(id);
  } catch (error) {
    console.error('Error getting project by ID:', error);
    throw new Error('Failed to get project');
  }
}

export async function getProjectByIdWithDetails(id: number): Promise<ProjectWithClientAndTeam | null> {
  try {
    return await ProjectService.getProjectByIdWithDetails(id);
  } catch (error) {
    console.error('Error getting project with details:', error);
    throw new Error('Failed to get project with details');
  }
}

export async function getProjectsByClientId(clientId: number): Promise<Project[]> {
  try {
    return await ProjectService.getProjectsByClientId(clientId);
  } catch (error) {
    console.error('Error getting projects by client ID:', error);
    throw new Error('Failed to get projects by client');
  }
}

export async function getProjectsByTeamId(teamId: number): Promise<Project[]> {
  try {
    return await ProjectService.getProjectsByTeamId(teamId);
  } catch (error) {
    console.error('Error getting projects by team ID:', error);
    throw new Error('Failed to get projects by team');
  }
}

export async function createProject(formData: FormData): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const clientId = parseInt(formData.get('client_id') as string);
    const teamId = parseInt(formData.get('team_id') as string);
    const status = formData.get('status') as 'Active' | 'Inactive' | 'Completed' | 'On Hold';
    const startDate = formData.get('start_date') as string | null;
    const endDate = formData.get('end_date') as string | null;

    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Project name is required' };
    }

    if (isNaN(clientId)) {
      return { success: false, error: 'Valid client is required' };
    }

    if (isNaN(teamId)) {
      return { success: false, error: 'Valid team is required' };
    }

    const projectData = {
      name: name.trim(),
      description: description?.trim() || null,
      client_id: clientId,
      team_id: teamId,
      status: status || 'Active',
      start_date: startDate ? new Date(startDate) : null,
      end_date: endDate ? new Date(endDate) : null,
    };

    const id = await ProjectService.createProject(projectData);
    
    revalidatePath('/projects');
    revalidatePath('/clients');
    revalidatePath('/teams');
    
    return { success: true, id };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function updateProject(id: number, formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const clientId = parseInt(formData.get('client_id') as string);
    const teamId = parseInt(formData.get('team_id') as string);
    const status = formData.get('status') as 'Active' | 'Inactive' | 'Completed' | 'On Hold';
    const startDate = formData.get('start_date') as string | null;
    const endDate = formData.get('end_date') as string | null;

    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Project name is required' };
    }

    if (isNaN(clientId)) {
      return { success: false, error: 'Valid client is required' };
    }

    if (isNaN(teamId)) {
      return { success: false, error: 'Valid team is required' };
    }

    const projectData = {
      name: name.trim(),
      description: description?.trim() || null,
      client_id: clientId,
      team_id: teamId,
      status: status || 'Active',
      start_date: startDate ? new Date(startDate) : null,
      end_date: endDate ? new Date(endDate) : null,
    };

    const success = await ProjectService.updateProject(id, projectData);
    
    if (success) {
      revalidatePath('/projects');
      revalidatePath('/clients');
      revalidatePath('/teams');
      return { success: true };
    } else {
      return { success: false, error: 'Project not found' };
    }
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function deleteProject(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await ProjectService.deleteProject(id);
    
    if (success) {
      revalidatePath('/projects');
      revalidatePath('/clients');
      revalidatePath('/teams');
      return { success: true };
    } else {
      return { success: false, error: 'Project not found' };
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}

export async function searchProjectsByName(searchTerm: string): Promise<ProjectWithClientAndTeam[]> {
  try {
    return await ProjectService.searchProjectsByName(searchTerm);
  } catch (error) {
    console.error('Error searching projects:', error);
    throw new Error('Failed to search projects');
  }
}

export async function getProjectStats(): Promise<{
  total: number;
  active: number;
  completed: number;
  onHold: number;
  inactive: number;
}> {
  try {
    return await ProjectService.getProjectStats();
  } catch (error) {
    console.error('Error getting project stats:', error);
    throw new Error('Failed to get project statistics');
  }
}
