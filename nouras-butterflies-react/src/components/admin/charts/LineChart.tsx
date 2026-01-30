import React from 'react';
import { cn } from '../../../utils/cn';
import type { ChartDataPoint } from '../../../types/admin';

interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 300,
  color = '#c18b98',
  className,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (point.value / maxValue) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  // Create gradient fill area
  const fillPoints = `${points} 100,0 0,100`;

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

      {/* Chart */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Fill area under line */}
        <polygon
          points={fillPoints}
          fill="url(#lineGradient)"
          className="transition-all duration-500"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (point.value / maxValue) * 100;
          return (
            <g key={index}>
              {/* Hover circle */}
              <circle
                cx={`${x}%`}
                cy={`${y}%`}
                r="12"
                fill="transparent"
                className="cursor-pointer group"
              />

              {/* Tooltip */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <rect
                  x={`${x}%`}
                  y={`${y - 8}%`}
                  width="80"
                  height="40"
                  rx="4"
                  fill="#1f2937"
                  transform={`translate(-40, -40)`}
                />
                <text
                  x={`${x}%`}
                  y={`${y - 5}%`}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  transform={`translate(0, -25)`}
                >
                  <tspan x="0" dy="0" className="font-medium">
                    {point.label}
                  </tspan>
                  <tspan x="0" dy="15">
                    ${point.value.toLocaleString()}
                  </tspan>
                </text>
              </g>

              {/* Data point */}
              <circle
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="white"
                stroke={color}
                strokeWidth="2"
                className="transition-all duration-200 group-hover:r-6"
              />
            </g>
          );
        })}
      </svg>

      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
        {data.map((point, index) => (
          <div key={index} className="flex-1 text-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
