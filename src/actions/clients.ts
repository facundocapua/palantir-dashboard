'use server';

import { revalidatePath } from 'next/cache';
import { ClientService } from '@/services/clientService';
import { Client, ClientWithProjectCount } from '@/types/database';

export async function getAllClients(): Promise<Client[]> {
  try {
    return await ClientService.getAllClients();
  } catch (error) {
    console.error('Error getting all clients:', error);
    throw new Error('Failed to get clients');
  }
}

export async function getAllClientsWithProjectCount(): Promise<ClientWithProjectCount[]> {
  try {
    return await ClientService.getAllClientsWithProjectCount();
  } catch (error) {
    console.error('Error getting clients with project count:', error);
    throw new Error('Failed to get clients with project count');
  }
}

export async function getClientById(id: number): Promise<Client | null> {
  try {
    return await ClientService.getClientById(id);
  } catch (error) {
    console.error('Error getting client by ID:', error);
    throw new Error('Failed to get client');
  }
}

export async function createClient(formData: FormData): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const name = formData.get('name') as string;

    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Client name is required' };
    }

    // Check if name already exists
    if (await ClientService.nameExists(name)) {
      return { success: false, error: 'Client name already exists' };
    }

    const clientData = {
      name: name.trim(),
    };

    const id = await ClientService.createClient(clientData);
    
    revalidatePath('/clients');
    revalidatePath('/projects');
    
    return { success: true, id };
  } catch (error) {
    console.error('Error creating client:', error);
    return { success: false, error: 'Failed to create client' };
  }
}

export async function updateClient(id: number, formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get('name') as string;

    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Client name is required' };
    }

    // Check if name already exists (excluding current client)
    if (await ClientService.nameExists(name, id)) {
      return { success: false, error: 'Client name already exists' };
    }

    const clientData = {
      name: name.trim(),
    };

    const success = await ClientService.updateClient(id, clientData);
    
    if (success) {
      revalidatePath('/clients');
      revalidatePath('/projects');
      return { success: true };
    } else {
      return { success: false, error: 'Client not found' };
    }
  } catch (error) {
    console.error('Error updating client:', error);
    return { success: false, error: 'Failed to update client' };
  }
}

export async function deleteClient(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await ClientService.deleteClient(id);
    
    if (success) {
      revalidatePath('/clients');
      revalidatePath('/projects');
      return { success: true };
    } else {
      return { success: false, error: 'Client not found' };
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete client';
    return { success: false, error: errorMessage };
  }
}

export async function searchClientsByName(searchTerm: string): Promise<Client[]> {
  try {
    return await ClientService.searchClientsByName(searchTerm);
  } catch (error) {
    console.error('Error searching clients:', error);
    throw new Error('Failed to search clients');
  }
}
