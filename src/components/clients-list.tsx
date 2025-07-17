'use client';

import { useState } from 'react';
import { ClientWithProjectCount } from '@/types/database';
import { deleteClient } from '@/actions/clients';
import { ClientForm } from './client-form';
import ConfirmDialog from './confirm-dialog';
import toast from 'react-hot-toast';

interface ClientsListProps {
  clients: ClientWithProjectCount[];
  onUpdate: () => void;
}

export function ClientsList({ clients, onUpdate }: ClientsListProps) {
  const [editingClient, setEditingClient] = useState<ClientWithProjectCount | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingClient, setDeletingClient] = useState<ClientWithProjectCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (client: ClientWithProjectCount) => {
    setDeletingClient(client);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingClient) return;

    setIsDeleting(true);
    try {
      const result = await deleteClient(deletingClient.id);
      if (result.success) {
        toast.success(`Client "${deletingClient.name}" has been deleted successfully.`);
        onUpdate();
      } else {
        toast.error(result.error || 'Failed to delete client');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
      setDeletingClient(null);
    }
  };

  const handleFormSuccess = () => {
    setEditingClient(null);
    setShowCreateForm(false);
    onUpdate();
  };

  const handleFormClose = () => {
    setEditingClient(null);
    setShowCreateForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Client
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projects
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {client.projectCount} {client.projectCount === 1 ? 'project' : 'projects'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(client)}
                    className="text-red-600 hover:text-red-900"
                    disabled={client.projectCount > 0}
                    title={client.projectCount > 0 ? 'Cannot delete client with projects' : 'Delete client'}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {clients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No clients found.</p>
          </div>
        )}
      </div>

      {showCreateForm && (
        <ClientForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {editingClient && (
        <ClientForm
          client={editingClient}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {deletingClient && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Client"
          message={`Are you sure you want to delete "${deletingClient.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingClient(null)}
          isProcessing={isDeleting}
        />
      )}
    </div>
  );
}
