import React from 'react';
import { GitHubStatistic } from '@/types/database';

interface GitHubStatsTableProps {
  statistics: GitHubStatistic[];
  loading?: boolean;
}

export function GitHubStatsTable({ statistics, loading = false }: GitHubStatsTableProps) {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (statistics.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">GitHub Statistics</h3>
        <p className="text-gray-500">No GitHub statistics found. Run the cron job to collect data.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">GitHub Statistics</h3>
        <p className="text-sm text-gray-500 mt-1">
          Weekly repository activity metrics
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Week Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Additions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deletions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statistics.map((stat) => (
              <tr key={stat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stat.project_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(stat.week_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                  +{stat.additions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                  -{stat.deletions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {stat.additions - stat.deletions >= 0 ? '+' : ''}{(stat.additions - stat.deletions).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(stat.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface GitHubStatsCardProps {
  statistics: GitHubStatistic[];
}

export function GitHubStatsCard({ statistics }: GitHubStatsCardProps) {
  const totalAdditions = statistics.reduce((sum, stat) => sum + stat.additions, 0);
  const totalDeletions = statistics.reduce((sum, stat) => sum + stat.deletions, 0);
  const netChange = totalAdditions - totalDeletions;
  const weekCount = statistics.length;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">GitHub Activity Summary</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            +{totalAdditions.toLocaleString()}
          </div>
          <div className="text-sm text-green-700">Total Additions</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            -{totalDeletions.toLocaleString()}
          </div>
          <div className="text-sm text-red-700">Total Deletions</div>
        </div>
        <div className={`rounded-lg p-4 ${netChange >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
          <div className={`text-2xl font-bold ${netChange >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
            {netChange >= 0 ? '+' : ''}{netChange.toLocaleString()}
          </div>
          <div className={`text-sm ${netChange >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            Net Change
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {weekCount}
          </div>
          <div className="text-sm text-gray-700">Weeks Tracked</div>
        </div>
      </div>
    </div>
  );
}
