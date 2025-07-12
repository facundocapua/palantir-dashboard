import AppLayout from "@/components/app-layout";
import ProgressStatsCard from "@/components/progress-stats-card";
import { ReportsService } from "@/services/reportsService";

async function getReportsData() {
  try {
    const stats = await ReportsService.getTeamStats();
    return stats;
  } catch (error) {
    console.error('Error fetching reports data:', error);
    return {
      roleStats: [],
      seniorityStats: [],
      teamStats: [],
      totalPeople: 0
    };
  }
}

export default async function ReportsPage() {
  const { roleStats, seniorityStats, teamStats, totalPeople } = await getReportsData();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-gray-900">Team Reports</h1>
            <p className="mt-2 text-sm text-gray-700">
              Overview of team distribution by role, seniority, and teams.
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total People</dt>
                  <dd className="text-lg font-semibold text-gray-900">{totalPeople}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Different Roles</dt>
                  <dd className="text-lg font-semibold text-gray-900">{roleStats.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Seniority Levels</dt>
                  <dd className="text-lg font-semibold text-gray-900">{seniorityStats.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Teams</dt>
                  <dd className="text-lg font-semibold text-gray-900">{teamStats.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ProgressStatsCard
            title="Distribution by Role"
            stats={roleStats}
            totalPeople={totalPeople}
            colors={[
              'bg-blue-500',
              'bg-green-500',
              'bg-yellow-500',
              'bg-red-500',
              'bg-purple-500',
              'bg-indigo-500',
              'bg-pink-500',
              'bg-orange-500',
              'bg-teal-500',
              'bg-cyan-500',
              'bg-lime-500',
              'bg-emerald-500',
              'bg-violet-500',
              'bg-fuchsia-500',
              'bg-rose-500',
            ]}
          />

          <ProgressStatsCard
            title="Distribution by Seniority"
            stats={seniorityStats}
            totalPeople={totalPeople}
            colors={[
              'bg-emerald-500',
              'bg-green-500',
              'bg-yellow-500',
              'bg-orange-500',
              'bg-red-500',
              'bg-purple-500',
              'bg-gray-500',
            ]}
          />

          <ProgressStatsCard
            title="Distribution by Team"
            stats={teamStats}
            totalPeople={totalPeople}
            colors={[
              'bg-indigo-500',
              'bg-purple-500',
              'bg-pink-500',
              'bg-rose-500',
              'bg-orange-500',
            ]}
          />
        </div>
      </div>
    </AppLayout>
  );
}
