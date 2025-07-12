import { StatItem } from '@/services/reportsService';

interface ProgressStatsCardProps {
  title: string;
  stats: StatItem[];
  totalPeople: number;
  colors?: string[];
}

const defaultColors = [
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
];

export default function ProgressStatsCard({ 
  title, 
  stats, 
  totalPeople, 
  colors = defaultColors 
}: ProgressStatsCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}
                />
                <span className="text-sm font-medium text-gray-900">{stat.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{stat.count}</span>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                  {stat.percentage}%
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Total People</span>
          <span className="text-lg font-semibold text-gray-900">{totalPeople}</span>
        </div>
      </div>
    </div>
  );
}
