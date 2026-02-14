import React from 'react';

export interface ChartProps {
  type?: 'line' | 'bar' | 'pie';
  title?: string;
}

export const Chart: React.FC<ChartProps> = ({ type = 'line', title }) => {
  const chartTitle = title || `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
  
  const getChartData = () => {
    switch(type) {
      case 'line': return [40, 65, 45, 70, 55, 80, 62];
      case 'bar': return [60, 45, 75, 50, 85, 40, 70];
      case 'pie': return [30, 25, 20, 15, 10];
      default: return [40, 65, 45, 70, 55, 80, 62];
    }
  };

  const getChartColor = () => {
    switch(type) {
      case 'line': return 'bg-blue-500';
      case 'bar': return 'bg-green-500';
      case 'pie': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const chartData = getChartData();
  const chartColor = getChartColor();

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
                {type === 'pie' ? `Cat ${i + 1}` : `Wk ${i + 1}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};