'use client';

import { useState } from 'react';
import { RoleWithUsageCount } from '@/types/database';
import { deleteRole } from '@/actions/roles';
import { RoleForm } from './role-form';
import toast from 'react-hot-toast';

interface RolesListProps {
  roles: RoleWithUsageCount[];
}

export function RolesList({ roles }: RolesListProps) {
  const [selectedRole, setSelectedRole] = useState<RoleWithUsageCount | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (role: RoleWithUsageCount) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleDelete = async (id: number, roleName: string) => {
    if (confirm(`Are you sure you want to delete the role "${roleName}"?`)) {
      const result = await deleteRole(id);
      if (result.success) {
        toast.success(`Role "${roleName}" has been deleted successfully.`);
      } else {
        toast.error(result.error || 'Failed to delete role');
      }
    }
  };

  const handleAdd = () => {
    setSelectedRole(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedRole(null);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Roles</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Role
        </button>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {roles.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 114 0v7.755M16 6H8m0 0V6a2 2 0 114 0v7.755M8 6v10l4-2 4 2V6"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first role.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Role
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Role Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Usage
                      </th>
                      <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {roles.map((role) => (
                      <tr key={role.id} className="hover:bg-gray-50">
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {role.name}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800">
                            {role.usageCount} person{role.usageCount !== 1 ? 's' : ''} assigned
                          </span>
                        </td>
                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(role)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(role.id, role.name)}
                              className="text-red-600 hover:text-red-900"
                              disabled={role.usageCount > 0}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Results Summary */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{roles.length}</span> role{roles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <RoleForm
          role={selectedRole}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
}
