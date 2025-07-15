import { Suspense } from 'react';
import { getTeamsWithMemberCount } from '@/actions/teams';
import { TeamsList } from '@/components/teams-list';

export default async function TeamsPage() {
  const teams = await getTeamsWithMemberCount();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Teams
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your organization teams and their members
        </p>
      </div>

      <Suspense fallback={<div>Loading teams...</div>}>
        <TeamsList teams={teams} />
      </Suspense>
    </div>
  );
}
