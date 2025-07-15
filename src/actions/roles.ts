'use server';

import { revalidatePath } from 'next/cache';
import { RoleService } from '@/services/roleService';
import { Role, RoleWithUsageCount, PersonWithTeamAndRole } from '@/types/database';

export async function getAllRoles(): Promise<Role[]> {
  try {
    return await RoleService.getAllRoles();
  } catch (error) {
    console.error('Error getting all roles:', error);
    throw new Error('Failed to get roles');
  }
}

export async function getRoleById(id: number): Promise<Role | null> {
  try {
    return await RoleService.getRoleById(id);
  } catch (error) {
    console.error('Error getting role by ID:', error);
    throw new Error('Failed to get role');
  }
}

export async function getRolesWithUsageCount(): Promise<RoleWithUsageCount[]> {
  try {
    return await RoleService.getRolesWithUsageCount();
  } catch (error) {
    console.error('Error getting roles with usage count:', error);
    throw new Error('Failed to get roles with usage count');
  }
}

export async function getPeopleByRole(roleId: number): Promise<PersonWithTeamAndRole[]> {
  try {
    return await RoleService.getPeopleByRole(roleId);
  } catch (error) {
    console.error('Error getting people by role:', error);
    throw new Error('Failed to get people by role');
  }
}

export async function createRole(name: string): Promise<{ success: boolean; data?: Role; error?: string }> {
  try {
    const role = await RoleService.createRole(name);
    revalidatePath('/roles');
    revalidatePath('/people');
    return { success: true, data: role };
  } catch (error) {
    console.error('Error creating role:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create role' 
    };
  }
}

export async function updateRole(id: number, name: string): Promise<{ success: boolean; data?: Role; error?: string }> {
  try {
    const role = await RoleService.updateRole(id, name);
    if (!role) {
      return { success: false, error: 'Role not found' };
    }
    revalidatePath('/roles');
    revalidatePath('/people');
    return { success: true, data: role };
  } catch (error) {
    console.error('Error updating role:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update role' 
    };
  }
}

export async function deleteRole(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await RoleService.deleteRole(id);
    if (!success) {
      return { success: false, error: 'Role not found' };
    }
    revalidatePath('/roles');
    revalidatePath('/people');
    return { success: true };
  } catch (error) {
    console.error('Error deleting role:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete role' 
    };
  }
}

export async function searchRoles(searchTerm: string): Promise<Role[]> {
  try {
    return await RoleService.searchRoles(searchTerm);
  } catch (error) {
    console.error('Error searching roles:', error);
    throw new Error('Failed to search roles');
  }
}

export async function getRoleUsageCount(id: number): Promise<number> {
  try {
    return await RoleService.getRoleUsageCount(id);
  } catch (error) {
    console.error('Error getting role usage count:', error);
    throw new Error('Failed to get role usage count');
  }
}

export async function isRoleNameAvailable(name: string, excludeId?: number): Promise<boolean> {
  try {
    return await RoleService.isRoleNameAvailable(name, excludeId);
  } catch (error) {
    console.error('Error checking role name availability:', error);
    throw new Error('Failed to check role name availability');
  }
}
