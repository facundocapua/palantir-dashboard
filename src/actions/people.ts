'use server';

import { PersonService } from '@/services/personService';
import { TeamService } from '@/services/teamService';
import { RoleService } from '@/services/roleService';
import { Person } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function getPeople() {
  try {
    const people = await PersonService.getAllPeople();
    return { success: true, data: people };
  } catch (error) {
    console.error('Error fetching people:', error);
    return { success: false, error: 'Failed to fetch people' };
  }
}

export async function getTeams() {
  try {
    const teams = await TeamService.getAllTeams();
    return { success: true, data: teams };
  } catch (error) {
    console.error('Error fetching teams:', error);
    return { success: false, error: 'Failed to fetch teams' };
  }
}

export async function getRoles() {
  try {
    const roles = await RoleService.getAllRoles();
    return { success: true, data: roles };
  } catch (error) {
    console.error('Error fetching roles:', error);
    return { success: false, error: 'Failed to fetch roles' };
  }
}

export async function createPerson(personData: Omit<Person, 'id'>) {
  try {
    const newPerson = await PersonService.createPerson(personData);
    revalidatePath('/people');
    return { success: true, data: newPerson };
  } catch (error) {
    console.error('Error creating person:', error);
    return { success: false, error: 'Failed to create person' };
  }
}

export async function updatePerson(id: number, personData: Partial<Omit<Person, 'id'>>) {
  try {
    const updatedPerson = await PersonService.updatePerson(id, personData);
    revalidatePath('/people');
    return { success: true, data: updatedPerson };
  } catch (error) {
    console.error('Error updating person:', error);
    return { success: false, error: 'Failed to update person' };
  }
}

export async function deletePerson(id: number) {
  try {
    const deleted = await PersonService.deletePerson(id);
    if (!deleted) {
      return { success: false, error: 'Person not found' };
    }
    revalidatePath('/people');
    return { success: true, data: { deleted: true } };
  } catch (error) {
    console.error('Error deleting person:', error);
    return { success: false, error: 'Failed to delete person' };
  }
}
