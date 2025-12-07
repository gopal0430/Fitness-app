import React from 'react';

interface RadialProgressProps {
  value: number;
  max: number;
  color: string;
  size: number;
  strokeWidth: number;
  label?: string;
  icon?: React.ReactNode;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ 
  value, 
  max, 
  color, 
  size, 
  strokeWidth,
  label,
  icon
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
        {icon && <div className="mb-1">{icon}</div>}
        <span className="text-xl font-bold">{value}</span>
        {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
      </div>
    </div>
  );
};

export default RadialProgress;