import React from 'react';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils/cn';

interface TrustBadgesProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

interface Badge {
  id: string;
  icon: string;
  label: string;
  description?: string;
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  className,
  variant = 'horizontal',
  size = 'md',
}) => {
  const badges: Badge[] = [
    {
      id: 'vegan',
      icon: 'eco',
      label: 'Vegan',
      description: '100% plant-based ingredients',
    },
    {
      id: 'cruelty-free',
      icon: 'cruelty_free',
      label: 'Cruelty Free',
      description: 'Never tested on animals',
    },
    {
      id: 'eco-pack',
      icon: 'recycling',
      label: 'Eco-Pack',
      description: 'Sustainable packaging',
    },
  ];

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizes = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  } as const;

  const containerClasses = cn(
    'flex gap-6',
    variant === 'vertical' ? 'flex-col' : 'flex-wrap justify-center',
    className
  );

  const badgeClasses = cn(
    'flex items-center gap-2 transition-all duration-300',
    'text-text-muted hover:text-primary',
    'hover:scale-105 cursor-pointer',
    sizeClasses[size]
  );

  return (
    <div className={containerClasses}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={badgeClasses}
          title={badge.description}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Could open a modal or show more info
            }
          }}
        >
          <Icon
            name={badge.icon}
            size={iconSizes[size]}
            className="transition-colors duration-300"
          />
          <span className="font-medium">{badge.label}</span>
        </div>
      ))}
    </div>
  );
};

TrustBadges.displayName = 'TrustBadges';
