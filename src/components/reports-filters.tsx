'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Team, Role } from '@/types/database';

interface ReportsFiltersProps {
  teams: Team[];
  roles: Role[];
  onFiltersChange: (filters: {
    selectedTeam: string;
    selectedRole: string;
    selectedSeniority: string;
  }) => void;
}

const SENIORITY_OPTIONS = ['JR I', 'JR II', 'SSR I', 'SSR II', 'SR I', 'SR II'];

export default function ReportsFilters({ teams, roles, onFiltersChange }: ReportsFiltersProps) {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSeniority, setSelectedSeniority] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const onFiltersChangeRef = useRef(onFiltersChange);
  onFiltersChangeRef.current = onFiltersChange;

  const applyFilters = useCallback(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }
    
    onFiltersChangeRef.current({
      selectedTeam,
      selectedRole,
      selectedSeniority,
    });
  }, [selectedTeam, selectedRole, selectedSeniority, isInitialized]);

  const clearFilters = () => {
    setSelectedTeam('');
    setSelectedRole('');
    setSelectedSeniority('');
  };

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Report Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
        </div>
      )}

      {/* Active Filters & Clear Button */}
      {(selectedTeam || selectedRole || selectedSeniority) && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
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
