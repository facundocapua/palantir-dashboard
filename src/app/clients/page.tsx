'use client';

import { Suspense, useEffect, useState } from 'react';
import { getAllClientsWithProjectCount } from '@/actions/clients';
import { ClientsList } from '@/components/clients-list';
import { ClientWithProjectCount } from '@/types/database';

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientWithProjectCount[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    try {
      const clientsData = await getAllClientsWithProjectCount();
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Clients
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your clients and their project portfolios
        </p>
      </div>

      <Suspense fallback={<div>Loading clients...</div>}>
        <ClientsList clients={clients} onUpdate={loadClients} />
      </Suspense>
    </div>
  );
}
