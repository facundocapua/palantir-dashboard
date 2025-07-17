'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PersonWithTeamAndRole } from '@/types/database';
import PersonCard from './person-card';

interface TeamStats {
  totalHours: number;
  hoursByRole: Record<string, number>;
  memberCount: number;
}

interface UnassignedPersonsCardProps {
  people: PersonWithTeamAndRole[];
  stats: TeamStats;
}

export default function UnassignedPersonsCard({ people, stats }: UnassignedPersonsCardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg shadow-sm border-2 transition-colors ${
        isOver ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
          Unassigned People
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">People:</span>
            <span className="ml-1 font-medium">{stats.memberCount}</span>
          </div>
          <div>
            <span className="text-gray-500">Total Hours:</span>
            <span className="ml-1 font-medium">{stats.totalHours}h</span>
          </div>
        </div>
        
        {Object.keys(stats.hoursByRole).length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Hours by Role:</p>
            <div className="space-y-1">
              {Object.entries(stats.hoursByRole).map(([role, hours]) => (
                <div key={role} className="flex justify-between text-xs">
                  <span className="text-gray-600">{role}:</span>
                  <span className="font-medium">{hours}h</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <SortableContext 
          items={people.map(p => p.id.toString())} 
          strategy={verticalListSortingStrategy}
        >
          {people.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">All people are assigned to teams</p>
              <p className="text-xs mt-1">Drag people here to unassign them</p>
            </div>
          ) : (
            <div className="space-y-2">
              {people.map(person => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
