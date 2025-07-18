'use client';

import { useState, useEffect } from 'react';
import { TeamCapacityAnalysis } from '@/types/database';
import { getTeamCapacityAnalysis } from '@/actions/projectedHours';

interface CapacityAnalysisContentProps {
  initialYear: number;
  initialMonth: number;
}

interface MonthlyAnalysis {
  year: number;
  month: number;
  analysis: TeamCapacityAnalysis[];
}

type ViewMode = 'detailed' | 'summary';

export default function CapacityAnalysisContent({ 
  initialYear, 
  initialMonth 
}: CapacityAnalysisContentProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [analysis, setAnalysis] = useState<TeamCapacityAnalysis[]>([]);
  const [summaryData, setSummaryData] = useState<MonthlyAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to generate next 6 months
  const generateNext6Months = (startYear: number, startMonth: number) => {
    const months = [];
    let currentYear = startYear;
    let currentMonth = startMonth;

    for (let i = 0; i < 6; i++) {
      months.push({ year: currentYear, month: currentMonth });
      
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
    return months;
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load detailed data for current month
        const result = await getTeamCapacityAnalysis(year, month);
        if (result.success) {
          setAnalysis(result.data || []);
        } else {
          setError(result.error || 'Failed to load capacity analysis');
        }

        // Load summary data for next 6 months
        const monthsToLoad = generateNext6Months(year, month);
        const summaryPromises = monthsToLoad.map(async ({ year: y, month: m }) => {
          const result = await getTeamCapacityAnalysis(y, m);
          return {
            year: y,
            month: m,
            analysis: result.success ? result.data || [] : []
          };
        });

        const summaryResults = await Promise.all(summaryPromises);
        setSummaryData(summaryResults);
      } catch {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [year, month]);

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const getCapacityStatus = (analysis: TeamCapacityAnalysis) => {
    // Calculate capacity difference percentage based on total capacity
    const capacityPercentage = analysis.totalMemberHours > 0 
      ? (analysis.capacityDifference / analysis.totalMemberHours) * 100 
      : 0;

    if (capacityPercentage > 20) {
      // More than 20% excess capacity -> red
      return { 
        status: 'excess-high', 
        label: 'High Excess Capacity', 
        color: 'text-red-600 bg-red-50',
        indicator: 'bg-red-500'
      };
    } else if (capacityPercentage > 0) {
      // 0-20% excess capacity -> orange/yellow
      return { 
        status: 'excess-low', 
        label: 'Slight Excess Capacity', 
        color: 'text-orange-600 bg-orange-50',
        indicator: 'bg-orange-500'
      };
    } else if (capacityPercentage >= -20) {
      // 0-20% projected hours exceed capacity -> green
      return { 
        status: 'optimal', 
        label: 'Optimal Utilization', 
        color: 'text-green-600 bg-green-50',
        indicator: 'bg-green-500'
      };
    } else if (capacityPercentage >= -40) {
      // 20-40% projected hours exceed capacity -> orange/yellow
      return { 
        status: 'shortage-moderate', 
        label: 'Moderate Overload', 
        color: 'text-yellow-600 bg-yellow-50',
        indicator: 'bg-yellow-500'
      };
    } else {
      // More than 40% overload -> red
      return { 
        status: 'shortage-high', 
        label: 'High Overload', 
        color: 'text-red-600 bg-red-50',
        indicator: 'bg-red-500'
      };
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage > 100) return 'text-red-600';
    if (percentage > 90) return 'text-yellow-600';
    if (percentage > 70) return 'text-green-600';
    return 'text-blue-600';
  };

  // Helper function to get capacity status color for summary cells
  const getCapacityStatusColor = (analysis: TeamCapacityAnalysis) => {
    const capacityPercentage = analysis.totalMemberHours > 0 
      ? (analysis.capacityDifference / analysis.totalMemberHours) * 100 
      : 0;

    if (capacityPercentage > 20) return 'bg-red-100 border-red-300';
    if (capacityPercentage > 0) return 'bg-orange-100 border-orange-300';
    if (capacityPercentage >= -20) return 'bg-green-100 border-green-300';
    if (capacityPercentage >= -40) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  // Get all unique teams from summary data
  const getAllTeams = () => {
    const teamsMap = new Map();
    summaryData.forEach(monthData => {
      monthData.analysis.forEach(teamAnalysis => {
        if (!teamsMap.has(teamAnalysis.team.id)) {
          teamsMap.set(teamAnalysis.team.id, teamAnalysis.team);
        }
      });
    });
    return Array.from(teamsMap.values());
  };

  // Get analysis for a specific team and month
  const getTeamAnalysisForMonth = (teamId: number, monthData: MonthlyAnalysis) => {
    return monthData.analysis.find(analysis => analysis.team.id === teamId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Capacity Analysis</h1>
          <p className="text-gray-600 mt-2">
            Compare team capacity against projected project hours
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'detailed'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Detailed
              </button>
              <button
                onClick={() => setViewMode('summary')}
                className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  viewMode === 'summary'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                6-Month Summary
              </button>
            </div>
          </div>

          {/* Month/Year Selectors */}
          <div className="flex items-center space-x-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                {viewMode === 'summary' ? 'Starting Month' : 'Month'}
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {getMonthName(i + 1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                {viewMode === 'summary' ? 'Starting Year' : 'Year'}
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Array.from({ length: 3 }, (_, i) => (
                  <option key={2024 + i} value={2024 + i}>
                    {2024 + i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-red-50 text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading capacity analysis...</div>
        </div>
      ) : viewMode === 'detailed' ? (
        /* Detailed View */
        <div className="grid gap-6">
          {analysis.map(teamAnalysis => {
            const capacityStatus = getCapacityStatus(teamAnalysis);
            
            return (
              <div key={teamAnalysis.team.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${capacityStatus.indicator}`}></div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{teamAnalysis.team.name}</h3>
                      <p className="text-sm text-gray-600">
                        {teamAnalysis.memberCount} team members
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${capacityStatus.color}`}>
                    {capacityStatus.label}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {teamAnalysis.totalMemberHours}h
                    </div>
                    <div className="text-sm text-gray-600">Total Capacity</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {teamAnalysis.totalProjectedHours}h
                    </div>
                    <div className="text-sm text-gray-600">Projected Hours</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      teamAnalysis.capacityDifference >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {teamAnalysis.capacityDifference >= 0 ? '+' : ''}{teamAnalysis.capacityDifference}h
                    </div>
                    <div className="text-sm text-gray-600">Difference</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getUtilizationColor(teamAnalysis.utilizationPercentage)}`}>
                      {teamAnalysis.utilizationPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">Utilization</div>
                  </div>
                </div>

                {teamAnalysis.projects.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Active Projects</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {teamAnalysis.projects.map(project => {
                        const projectedHours = project.projectedHours[0]?.projected_hours || 0;
                        const utilizationPercent = teamAnalysis.totalMemberHours > 0 
                          ? Math.round((projectedHours / teamAnalysis.totalMemberHours) * 100)
                          : 0;
                        
                        return (
                          <div key={project.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                                {project.name}
                              </h5>
                              <div className={`w-2 h-2 rounded-full ml-2 mt-1 flex-shrink-0 ${
                                utilizationPercent > 50 ? 'bg-red-400' : 
                                utilizationPercent > 30 ? 'bg-yellow-400' : 'bg-green-400'
                              }`}></div>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {project.client.name}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold text-gray-900">
                                {projectedHours}h
                              </div>
                              <div className="text-xs text-gray-500">
                                {utilizationPercent}% utilization
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {teamAnalysis.projects.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No active projects assigned to this team
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Summary View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    Team
                  </th>
                  {summaryData.map(monthData => (
                    <th key={`${monthData.year}-${monthData.month}`} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                      {getMonthName(monthData.month)} {monthData.year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getAllTeams().map(team => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200">
                      {team.name}
                    </td>
                    {summaryData.map(monthData => {
                      const teamAnalysis = getTeamAnalysisForMonth(team.id, monthData);
                      
                      if (!teamAnalysis) {
                        return (
                          <td key={`${monthData.year}-${monthData.month}`} className="px-4 py-4 text-center">
                            <div className="text-xs text-gray-400">No data</div>
                          </td>
                        );
                      }
                      
                      return (
                        <td key={`${monthData.year}-${monthData.month}`} className="px-4 py-4">
                          <div className={`rounded-lg border-2 p-3 ${getCapacityStatusColor(teamAnalysis)}`}>
                            <div className="text-center">
                              <div className="text-sm font-semibold text-gray-900">
                                {teamAnalysis.totalMemberHours}h / {teamAnalysis.totalProjectedHours}h
                              </div>
                              <div className={`text-xs font-medium mt-1 ${
                                teamAnalysis.capacityDifference >= 0 ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {teamAnalysis.capacityDifference >= 0 ? '+' : ''}{teamAnalysis.capacityDifference}h
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                {teamAnalysis.utilizationPercentage}% util.
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Legend */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">Legend:</h4>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                  <span>Optimal (0-20% over/under)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></div>
                  <span>Slight excess (0-20%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
                  <span>Moderate overload (20-40%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
                  <span>High excess/overload (&gt;20%/40%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && viewMode === 'detailed' && analysis.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No teams found</p>
        </div>
      )}

      {!isLoading && viewMode === 'summary' && summaryData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available for summary</p>
        </div>
      )}
    </div>
  );
}
