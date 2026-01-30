import React from 'react';

type ButterflyPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type ButterflySize = 'sm' | 'md' | 'lg';

interface ButterflyDecorProps {
  position?: ButterflyPosition;
  size?: ButterflySize;
  className?: string;
}

const ButterflySVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M50 50 C30 30, 10 35, 10 50 C10 65, 30 70, 50 50 C70 70, 90 65, 90 50 C90 35, 70 30, 50 50 Z" />
    <path d="M50 50 C35 35, 25 40, 25 50 C25 60, 35 65, 50 50 C65 65, 75 60, 75 50 C75 40, 65 35, 50 50 Z" />
    <rect x="48" y="45" width="4" height="10" rx="2" />
  </svg>
);

export const ButterflyDecor: React.FC<ButterflyDecorProps> = ({
  position = 'top-left',
  size = 'md',
  className = '',
}) => {
  const getPositionClasses = (pos: ButterflyPosition): string => {
    switch (pos) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 left-4';
    }
  };

  const getSizeClasses = (size: ButterflySize): string => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'md':
        return 'h-12 w-12';
      case 'lg':
        return 'h-16 w-16';
      default:
        return 'h-12 w-12';
    }
  };

  const getColorClass = (): string => {
    // Use gradient colors based on position
    switch (position) {
      case 'top-left':
        return 'text-pink-400';
      case 'top-right':
        return 'text-yellow-400';
      case 'bottom-left':
        return 'text-purple-400';
      case 'bottom-right':
        return 'text-indigo-400';
      default:
        return 'text-pink-400';
    }
  };

  return (
    <div
      className={`
        absolute ${getPositionClasses(position)} 
        ${getSizeClasses(size)} 
        ${getColorClass()}
        opacity-60
        animate-float
        pointer-events-none
        ${className}
      `}
      style={{
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    >
      <ButterflySVG className="h-full w-full drop-shadow-sm" />
    </div>
  );
};

// Multiple butterflies component for easier usage
interface ButterflySwarmProps {
  count?: number;
  className?: string;
}

export const ButterflySwarm: React.FC<ButterflySwarmProps> = ({ count = 3, className = '' }) => {
  const positions: ButterflyPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const sizes: ButterflySize[] = ['sm', 'md', 'lg'];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, index) => {
        const position = positions[index % positions.length];
        const size = sizes[index % sizes.length];

        return <ButterflyDecor key={index} position={position} size={size} />;
      })}
    </div>
  );
};
