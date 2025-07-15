'use client';

import { useState } from 'react';
import { TeamWithMemberCount } from '@/types/database';
import { deleteTeam } from '@/actions/teams';
import { TeamForm } from './team-form';
import toast from 'react-hot-toast';

interface TeamsListProps {
  teams: TeamWithMemberCount[];
}

export function TeamsList({ teams }: TeamsListProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamWithMemberCount | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (team: TeamWithMemberCount) => {
    setSelectedTeam(team);
    setShowForm(true);
  };

  const handleDelete = async (id: number, teamName: string) => {
    if (confirm(`Are you sure you want to delete the team "${teamName}"?`)) {
      const result = await deleteTeam(id);
      if (result.success) {
        toast.success(`Team "${teamName}" has been deleted successfully.`);
      } else {
        toast.error(result.error || 'Failed to delete team');
      }
    }
  };

  const handleAdd = () => {
    setSelectedTeam(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTeam(null);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Teams</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Team
        </button>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {teams.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No teams found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first team.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Team
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Team Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Members
                      </th>
                      <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {teams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {team.name}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-blue-100 text-blue-800">
                            {team.memberCount} member{team.memberCount !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(team)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(team.id, team.name)}
                              className="text-red-600 hover:text-red-900"
                              disabled={team.memberCount > 0}
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
                Showing <span className="font-medium">{teams.length}</span> team{teams.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <TeamForm
          team={selectedTeam}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  );
}
