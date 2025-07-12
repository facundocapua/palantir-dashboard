'use client';

import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Team, Role, PersonWithTeamAndRole } from '@/types/database';

interface PeopleFiltersProps {
  people: PersonWithTeamAndRole[];
  teams: Team[];
  roles: Role[];
  onFilteredPeople: (filteredPeople: PersonWithTeamAndRole[]) => void;
}

const SENIORITY_OPTIONS = ['JR I', 'JR II', 'SSR I', 'SSR II', 'SR I', 'SR II'];
const CONTRACT_OPTIONS = ['Employee', 'Contractor'];

export default function PeopleFilters({ people, teams, roles, onFilteredPeople }: PeopleFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSeniority, setSelectedSeniority] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = useCallback(() => {
    let filtered = people;

    // Filter by search term (name)
    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by team
    if (selectedTeam) {
      filtered = filtered.filter(person => 
        person.team?.name === selectedTeam
      );
    }

    // Filter by role
    if (selectedRole) {
      filtered = filtered.filter(person => 
        person.role === selectedRole || person.roleDetail?.name === selectedRole
      );
    }

    // Filter by seniority
    if (selectedSeniority) {
      filtered = filtered.filter(person => 
        person.seniority === selectedSeniority
      );
    }

    // Filter by contract
    if (selectedContract) {
      filtered = filtered.filter(person => 
        person.contract === selectedContract
      );
    }

    onFilteredPeople(filtered);
  }, [searchTerm, selectedTeam, selectedRole, selectedSeniority, selectedContract, people, onFilteredPeople]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTeam('');
    setSelectedRole('');
    setSelectedSeniority('');
    setSelectedContract('');
    onFilteredPeople(people);
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Search & Filter</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Team Filter */}
          <div>
            <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <select
              id="team-filter"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role-filter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Seniority Filter */}
          <div>
            <label htmlFor="seniority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Seniority
            </label>
            <select
              id="seniority-filter"
              value={selectedSeniority}
              onChange={(e) => setSelectedSeniority(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Seniorities</option>
              {SENIORITY_OPTIONS.map((seniority) => (
                <option key={seniority} value={seniority}>
                  {seniority}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Filter */}
          <div>
            <label htmlFor="contract-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Contract
            </label>
            <select
              id="contract-filter"
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Contracts</option>
              {CONTRACT_OPTIONS.map((contract) => (
                <option key={contract} value={contract}>
                  {contract}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters & Clear Button */}
      {(searchTerm || selectedTeam || selectedRole || selectedSeniority || selectedContract) && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Name: {searchTerm}
              </span>
            )}
            {selectedTeam && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Team: {selectedTeam}
              </span>
            )}
            {selectedRole && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Role: {selectedRole}
              </span>
            )}
            {selectedSeniority && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Seniority: {selectedSeniority}
              </span>
            )}
            {selectedContract && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Contract: {selectedContract}
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
