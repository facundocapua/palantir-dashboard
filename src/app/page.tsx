import { TeamService } from "@/services/teamService";
import { PersonService } from "@/services/personService";
import { RoleService } from "@/services/roleService";

async function getDashboardData() {
  try {
    const [teams, people, roles] = await Promise.all([
      TeamService.getAllTeams(),
      PersonService.getAllPeople(),
      RoleService.getAllRoles()
    ]);

    return {
      totalPeople: people.length,
      totalTeams: teams.length,
      totalRoles: roles.length,
      teams: teams.slice(0, 3), // Show first 3 teams
      recentPeople: people.slice(0, 5) // Show first 5 people
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      totalPeople: 0,
      totalTeams: 0,
      totalRoles: 0,
      teams: [],
      recentPeople: []
    };
  }
}

export default async function Home() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900">Dashboard</h1>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Welcome to Palantir - your team and people management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Total People</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{data.totalPeople}</p>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Active Teams</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{data.totalTeams}</p>
          </dd>
        </div>

        <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Roles</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{data.totalRoles}</p>
          </dd>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Teams Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Teams Overview</h3>
            <div className="mt-5 space-y-4">
              {data.teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{team.name}</p>
                    <p className="text-sm text-gray-500">Team #{team.id}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Active
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent People */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent People</h3>
            <div className="mt-5 space-y-4">
              {data.recentPeople.map((person) => (
                <div key={person.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {person.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {person.roleDetail?.name || 'N/A'} - {person.team?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {person.seniority || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
          <div className="mt-5">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Database Connected</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Your MySQL database is connected and showing live data.
                      Use the navigation menu to explore people and teams in your organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
