'use client';

import { useState } from 'react';
import { ProjectWithClientAndTeam, ProjectProjectedHours } from '@/types/database';
import { bulkUpdateProjectedHours } from '@/actions/projectedHours';

interface ProjectedHoursFormProps {
  projects: ProjectWithClientAndTeam[];
  initialProjectedHours: ProjectProjectedHours[];
  year: number;
}

export default function ProjectedHoursForm({ 
  projects, 
  initialProjectedHours, 
  year 
}: ProjectedHoursFormProps) {
  // Create a map for projected hours by project and month
  const [projectedHours, setProjectedHours] = useState(() => {
    const hoursMap = new Map<string, number>();
    initialProjectedHours.forEach(ph => {
      const key = `${ph.project_id}-${ph.month}`;
      hoursMap.set(key, ph.projected_hours);
    });
    return hoursMap;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleHoursChange = (projectId: number, month: number, hours: string) => {
    const numericHours = parseInt(hours) || 0;
    const key = `${projectId}-${month}`;
    setProjectedHours(prev => new Map(prev.set(key, numericHours)));
  };

  const getProjectHours = (projectId: number, month: number): number => {
    const key = `${projectId}-${month}`;
    return projectedHours.get(key) || 0;
  };

  const getProjectTotalHours = (projectId: number): number => {
    let total = 0;
    for (let month = 1; month <= 12; month++) {
      total += getProjectHours(projectId, month);
    }
    return total;
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const updates: Array<{
        projectId: number;
        year: number;
        month: number;
        projectedHours: number;
      }> = [];

      // Collect all non-zero projected hours
      projects.forEach(project => {
        for (let month = 1; month <= 12; month++) {
          const hours = getProjectHours(project.id, month);
          if (hours > 0) {
            updates.push({
              projectId: project.id,
              year,
              month,
              projectedHours: hours
            });
          }
        }
      });

      const result = await bulkUpdateProjectedHours(updates);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'All projected hours updated successfully' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update projected hours' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalHoursByMonth = (): number[] => {
    const totals = new Array(12).fill(0);
    projects.forEach(project => {
      for (let month = 1; month <= 12; month++) {
        totals[month - 1] += getProjectHours(project.id, month);
      }
    });
    return totals;
  };

  const monthlyTotals = getTotalHoursByMonth();
  const grandTotal = monthlyTotals.reduce((sum, total) => sum + total, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Projected Hours for {year}
        </h2>
        <p className="text-gray-600 mt-2">
          Set the projected hours needed for each project throughout the year
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 border-r border-gray-200 min-w-[250px]">
                  Project
                </th>
                {monthNames.map((month) => (
                  <th key={month} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    {month}
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] bg-blue-50">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 sticky left-0 bg-white border-r border-gray-200">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">
                        {project.client.name} | {project.team.name}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'Active' ? 'bg-green-100 text-green-800' :
                          project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  {Array.from({ length: 12 }, (_, monthIndex) => {
                    const month = monthIndex + 1;
                    return (
                      <td key={month} className="px-3 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          value={getProjectHours(project.id, month)}
                          onChange={(e) => handleHoursChange(project.id, month, e.target.value)}
                          className="w-full text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                          placeholder="0"
                        />
                      </td>
                    );
                  })}
                  <td className="px-3 py-4 text-center bg-blue-50">
                    <div className="text-sm font-medium text-blue-900">
                      {getProjectTotalHours(project.id)}
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Totals row */}
              <tr className="bg-gray-100 border-t-2 border-gray-300">
                <td className="px-6 py-4 sticky left-0 bg-gray-100 border-r border-gray-200">
                  <div className="text-sm font-bold text-gray-900">Monthly Totals</div>
                </td>
                {monthlyTotals.map((total, index) => (
                  <td key={index} className="px-3 py-4 text-center">
                    <div className="text-sm font-medium text-gray-900">{total}</div>
                  </td>
                ))}
                <td className="px-3 py-4 text-center bg-blue-100">
                  <div className="text-sm font-bold text-blue-900">{grandTotal}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No active projects found</p>
        </div>
      )}
    </div>
  );
}
