'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PersonWithTeamAndRole } from '@/types/database';

interface PersonCardProps {
  person: PersonWithTeamAndRole;
  isDragging?: boolean;
}

export default function PersonCard({ person, isDragging = false }: PersonCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: person.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSeniorityColor = (seniority: string | null) => {
    switch (seniority) {
      case 'JR I':
      case 'JR II':
        return 'bg-green-100 text-green-800';
      case 'SSR I':
      case 'SSR II':
        return 'bg-blue-100 text-blue-800';
      case 'SR I':
      case 'SR II':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging || isSortableDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
      } ${isDragging ? 'rotate-3' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {person.name}
          </h4>
          
          <div className="mt-1 flex flex-wrap gap-1">
            {person.roleDetail && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                {person.roleDetail.name}
              </span>
            )}
            
            {person.seniority && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeniorityColor(person.seniority)}`}>
                {person.seniority}
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {person.monthly_hours}h/month
            {person.contract && (
              <span className="ml-2">• {person.contract}</span>
            )}
            {person.english_level && (
              <span className="ml-2">• English: {person.english_level}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
