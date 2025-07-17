'use client';

import { useState, useEffect } from 'react';
import PeopleFilters from '@/components/people-filters';
import PersonForm from '@/components/person-form';
import ConfirmDialog from '@/components/confirm-dialog';
import { Team, Role, PersonWithTeamAndRole, Person } from '@/types/database';
import toast from 'react-hot-toast';

interface PeopleTableProps {
  people: PersonWithTeamAndRole[];
  teams: Team[];
  roles: Role[];
  onDataChange: () => void;
}

export default function PeopleTable({ people, teams, roles, onDataChange }: PeopleTableProps) {
  const [filteredPeople, setFilteredPeople] = useState<PersonWithTeamAndRole[]>(people);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersonWithTeamAndRole | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<PersonWithTeamAndRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update filtered people when people prop changes
  useEffect(() => {
    setFilteredPeople(people);
  }, [people]);

  const handleFilteredPeople = (filtered: PersonWithTeamAndRole[]) => {
    setFilteredPeople(filtered);
  };

  const handleAddPerson = () => {
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const handleEditPerson = (person: PersonWithTeamAndRole) => {
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const handleDeletePerson = (person: PersonWithTeamAndRole) => {
    setPersonToDelete(person);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (personData: Omit<Person, 'id'>) => {
    setIsSubmitting(true);
    try {
      const { createPerson, updatePerson } = await import('@/actions/people');
      
      const result = editingPerson 
        ? await updatePerson(editingPerson.id, personData)
        : await createPerson(personData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to save person');
      }

      setIsFormOpen(false);
      setEditingPerson(null);
      onDataChange();

      // Show success notification
      toast.success(`${personData.name} has been ${editingPerson ? 'updated' : 'added'} to the team.`);
    } catch (error) {
      console.error('Error saving person:', error);
      
      // Show error notification
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!personToDelete) return;

    setIsSubmitting(true);
    try {
      const { deletePerson } = await import('@/actions/people');
      const result = await deletePerson(personToDelete.id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete person');
      }

      setIsDeleteDialogOpen(false);
      setPersonToDelete(null);
      onDataChange();

      // Show success notification
      toast.success(`${personToDelete.name} has been removed from the team.`);
    } catch (error) {
      console.error('Error deleting person:', error);
      
      // Show error notification
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingPerson(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setPersonToDelete(null);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">People</h2>
        <button
          onClick={handleAddPerson}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Person
        </button>
      </div>

      <PeopleFilters 
        people={people} 
        teams={teams} 
        roles={roles} 
        onFilteredPeople={handleFilteredPeople} 
      />
      
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {filteredPeople.length === 0 ? (
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1m0 0H8m0 0V4a1 1 0 011-1h4a1 1 0 011 1v1"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No people found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Team
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Seniority
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Contract
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        English Level
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Monthly Hours
                      </th>
                      <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredPeople.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-50">
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {person.name}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {person.roleDetail?.name || 'N/A'}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {person.team?.name || 'N/A'}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {person.seniority ? (
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              person.seniority.includes('SR')
                                ? 'bg-green-100 text-green-800'
                                : person.seniority.includes('SSR')
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {person.seniority}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {person.contract || 'N/A'}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {person.english_level ? (
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              person.english_level.includes('C')
                                ? 'bg-green-100 text-green-800'
                                : person.english_level.includes('B')
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {person.english_level}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {person.monthly_hours}h
                          </span>
                        </td>
                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditPerson(person)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePerson(person)}
                              className="text-red-600 hover:text-red-900"
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
                Showing <span className="font-medium">{filteredPeople.length}</span> of{' '}
                <span className="font-medium">{people.length}</span> people
              </p>
              {filteredPeople.length !== people.length && (
                <p className="text-sm text-gray-500">
                  {people.length - filteredPeople.length} people filtered out
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Person Form Modal */}
      {isFormOpen && (
        <PersonForm
          person={editingPerson}
          teams={teams}
          roles={roles}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Person"
        message={`Are you sure you want to delete ${personToDelete?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isProcessing={isSubmitting}
      />
    </div>
  );
}
