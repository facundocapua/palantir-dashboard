'use client';

import { useState } from 'react';
import { Team, Role, Person, PersonWithTeamAndRole } from '@/types/database';

interface PersonFormProps {
  person?: PersonWithTeamAndRole | null;
  teams: Team[];
  roles: Role[];
  onSubmit: (person: Omit<Person, 'id'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function PersonForm({
  person,
  teams,
  roles,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PersonFormProps) {
  const [formData, setFormData] = useState<Omit<Person, 'id'>>({
    name: person?.name || '',
    seniority: person?.seniority || null,
    contract: person?.contract || null,
    team_id: person?.team_id || null,
    role_id: person?.role_id || null,
    english_level: person?.english_level || null,
    monthly_hours: person?.monthly_hours || 0,
  });

  const seniorityOptions = [
    'JR I',
    'JR II', 
    'SSR I',
    'SSR II',
    'SR I',
    'SR II',
  ];

  const contractOptions = ['Employee', 'Contractor'];

  const englishLevelOptions = [
    'A1',
    'A2',
    'B1',
    'B2',
    'C1',
    'C2',
  ];

  const handleChange = (field: keyof Omit<Person, 'id'>, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {person ? 'Edit Person' : 'Add New Person'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter person's name"
              />
            </div>

            {/* Team */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team
              </label>
              <select
                value={formData.team_id || ''}
                onChange={(e) => handleChange('team_id', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role_id || ''}
                onChange={(e) => handleChange('role_id', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seniority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seniority
              </label>
              <select
                value={formData.seniority || ''}
                onChange={(e) => handleChange('seniority', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select seniority</option>
                {seniorityOptions.map((seniority) => (
                  <option key={seniority} value={seniority}>
                    {seniority}
                  </option>
                ))}
              </select>
            </div>

            {/* Contract */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract
              </label>
              <select
                value={formData.contract || ''}
                onChange={(e) => handleChange('contract', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select contract type</option>
                {contractOptions.map((contract) => (
                  <option key={contract} value={contract}>
                    {contract}
                  </option>
                ))}
              </select>
            </div>

            {/* English Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                English Level (CEFR)
              </label>
              <select
                value={formData.english_level || ''}
                onChange={(e) => handleChange('english_level', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select English level</option>
                {englishLevelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Hours
              </label>
              <input
                type="number"
                min="0"
                max="744"
                value={formData.monthly_hours}
                onChange={(e) => handleChange('monthly_hours', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter monthly hours produced"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of hours produced per month (0-744)
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Saving...' : (person ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
