'use client';

import React, { useEffect, useState } from 'react';
import { GitHubStatistic } from '@/types/database';
import { GitHubStatsTable, GitHubStatsCard } from '@/components/github-stats';
import { processAllGitHubStatistics } from '@/actions/githubStatistics';
import toast from 'react-hot-toast';

export default function GitHubStatsPage() {
  const [statistics, setStatistics] = useState<GitHubStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      // For now, we'll fetch all statistics. In a real app, you might want to paginate
      const response = await fetch('/api/github-stats');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error('Error loading GitHub statistics:', error);
      toast.error('Failed to load GitHub statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessStats = async () => {
    try {
      setProcessing(true);
      toast.loading('Processing GitHub statistics...');
      
      const result = await processAllGitHubStatistics();
      
      if (result.success) {
        toast.dismiss();
        toast.success(result.message);
        await loadStatistics(); // Reload the data
      } else {
        toast.dismiss();
        toast.error(result.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to process GitHub statistics');
      console.error('Error processing GitHub statistics:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GitHub Statistics</h1>
              <p className="text-gray-600 mt-2">
                Weekly repository activity metrics for all projects
              </p>
            </div>
            <button
              onClick={handleProcessStats}
              disabled={processing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Collect Statistics'
              )}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && statistics.length > 0 && (
          <div className="mb-8">
            <GitHubStatsCard statistics={statistics} />
          </div>
        )}

        {/* Statistics Table */}
        <GitHubStatsTable statistics={statistics} loading={loading} />

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-medium text-blue-900 mb-2">About GitHub Statistics</h3>
          <div className="text-blue-800 space-y-2">
            <p>
              GitHub statistics are collected weekly using the GitHub API&apos;s commit activity endpoint.
              The system tracks additions and deletions for each project repository.
            </p>
            <p>
              <strong>Automated Collection:</strong> Set up a cron job to run weekly:
            </p>
            <code className="block bg-blue-100 p-2 rounded text-sm mt-2">
              0 2 * * 1 cd /path/to/palantir && npm run github-stats-cron
            </code>
            <p className="text-sm text-blue-700 mt-2">
              This runs every Monday at 2 AM. Make sure to set the GITHUB_TOKEN environment variable for authenticated requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
