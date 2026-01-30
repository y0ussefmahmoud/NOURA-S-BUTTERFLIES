import React from 'react';
import { cn } from '../../../utils/cn';
import type { ChartDataPoint } from '../../../types/admin';

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 300, className }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className={cn('w-full relative', className)} style={{ height }}>
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => {
          const y = (i + 1) * 20; // 20%, 40%, 60%, 80%, 100%
          return (
            <line
              key={i}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}
      </svg>

      {/* Bars */}
      <div className="relative h-full flex items-end justify-between px-2">
        {data.map((point, index) => {
          const height = (point.value / maxValue) * 100;
          return (
            <div
              key={index}
              className="relative flex flex-col items-center flex-1 mx-1 group"
              style={{ height: '100%' }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                <div className="font-medium">{point.label}</div>
                <div>${point.value.toLocaleString()}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
              </div>

              {/* Bar */}
              <div
                className="w-full bg-gradient-to-t from-admin-primary to-admin-primary/80 rounded-t-sm transition-all duration-500 ease-out hover:from-admin-primary hover:to-admin-primary cursor-pointer"
                style={{
                  height: `${height}%`,
                  animation: `growBar 0.5s ease-out ${index * 0.1}s both`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between px-2 mt-2">
        {data.map((point, index) => (
          <div key={index} className="flex-1 text-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">{point.label}</span>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes growBar {
          from {
            height: 0%;
          }
          to {
            height: var(--bar-height);
          }
        }
      `}</style>
    </div>
  );
};
