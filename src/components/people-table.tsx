'use client';

import { useState } from 'react';
import PeopleFilters from '@/components/people-filters';
import { Team, Role, PersonWithTeamAndRole } from '@/types/database';

interface PeopleTableProps {
  people: PersonWithTeamAndRole[];
  teams: Team[];
  roles: Role[];
}

export default function PeopleTable({ people, teams, roles }: PeopleTableProps) {
  const [filteredPeople, setFilteredPeople] = useState<PersonWithTeamAndRole[]>(people);

  const handleFilteredPeople = (filtered: PersonWithTeamAndRole[]) => {
    setFilteredPeople(filtered);
  };

  return (
    <div className="mt-8">
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
                      <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                        <span className="sr-only">Edit</span>
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
                          {person.role || person.roleDetail?.name || 'N/A'}
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
                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {person.name}</span>
                          </a>
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
    </div>
  );
}
