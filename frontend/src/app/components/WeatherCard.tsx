import { LucideIcon } from 'lucide-react';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  category?: string;
  color?: string;
  direction?: number;
}

export default function WeatherCard({
  title,
  value,
  unit,
  icon: Icon,
  category,
  color = '#088395',
  direction
}: WeatherCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} strokeWidth={2} />
        </div>
        {direction !== undefined && (
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${direction}deg)` }}
            >
              <div className="w-1 h-5 bg-[#088395] rounded-full"></div>
              <div className="absolute top-0 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#088395]"></div>
            </div>
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm font-medium text-gray-500">{unit}</span>
      </div>

      {category && (
        <p className="text-xs font-medium mt-2 px-2 py-1 rounded-full inline-block"
           style={{ backgroundColor: `${color}15`, color }}>
          {category}
        </p>
      )}
    </div>
  );
}
