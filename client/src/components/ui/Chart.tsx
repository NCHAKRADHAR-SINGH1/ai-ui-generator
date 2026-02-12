import React from 'react';

export interface ChartProps {
  type?: 'line' | 'bar' | 'pie';
  title?: string;
  data?: number[]; // Optional custom data
}

export const Chart: React.FC<ChartProps> = ({ 
  type = 'line', 
  title,
  data 
}) => {
  // USE the type parameter to determine chart style
  const getChartData = (): number[] => {
    if (data && data.length > 0) return data;
    
    // Use type to return different mock datasets
    switch(type) {
      case 'line':
        return [40, 65, 45, 70, 55, 80, 62];
      case 'bar':
        return [60, 45, 75, 50, 85, 40, 70];
      case 'pie':
        return [30, 25, 20, 15, 10];
      default:
        return [40, 65, 45, 70, 55, 80, 62];
    }
  };

  // USE the type parameter for colors
  const getChartColors = (): string => {
    switch(type) {
      case 'line': return 'bg-blue-500';
      case 'bar': return 'bg-green-500';
      case 'pie': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  // USE the type parameter for labels
  const getLabels = (index: number): string => {
    switch(type) {
      case 'pie':
        return `Cat ${index + 1}`;
      case 'line':
      case 'bar':
      default:
        return `Wk ${index + 1}`;
    }
  };

  // USE the title parameter
  const chartTitle = title || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
  
  const chartData = getChartData();
  const chartColor = getChartColors();

  return (
    <div className="w-full h-64 bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">{chartTitle}</h4>
        <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">
          {type}
        </span>
      </div>
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 flex items-end justify-around">
          {chartData.map((height, i) => (
            <div key={i} className="flex flex-col items-center w-full max-w-[40px]">
              <div 
                className={`w-8 ${chartColor} rounded-t transition-all duration-300 hover:opacity-80`}
                style={{ height: `${height}%` }}
              />
              <span className="text-xs mt-1 text-gray-600">
                {getLabels(i)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {type === 'line' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          • Line chart showing trend over time
        </div>
      )}
      {type === 'bar' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          • Bar chart comparing values
        </div>
      )}
      {type === 'pie' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          • Pie chart showing distribution
        </div>
      )}
    </div>
  );
};