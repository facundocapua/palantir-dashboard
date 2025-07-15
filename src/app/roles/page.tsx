import { Suspense } from 'react';
import { getRolesWithUsageCount } from '@/actions/roles';
import { RolesList } from '@/components/roles-list';

export default async function RolesPage() {
  const roles = await getRolesWithUsageCount();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Roles
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your organization roles and assignments
        </p>
      </div>

      <Suspense fallback={<div>Loading roles...</div>}>
        <RolesList roles={roles} />
      </Suspense>
    </div>
  );
}
