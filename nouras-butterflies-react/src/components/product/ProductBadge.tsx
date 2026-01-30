import React from 'react';
import { Badge } from '../ui/Badge';
import type { ProductBadge as ProductBadgeType } from '../../types/product';

interface ProductBadgeProps {
  badge: ProductBadgeType;
  compact?: boolean;
}

const badgeConfig = {
  new: {
    variant: 'new' as const,
    icon: 'new_releases',
    className: '',
    ariaLabel: 'New arrival',
  },
  bestseller: {
    variant: 'bestseller' as const,
    icon: 'star',
    className: '',
    ariaLabel: 'Bestseller',
  },
  sale: {
    variant: 'error' as const,
    icon: 'local_offer',
    className: '',
    ariaLabel: 'On sale',
  },
  vegan: {
    variant: 'success' as const,
    icon: 'eco',
    className: '',
    ariaLabel: 'Vegan formula',
  },
  'cruelty-free': {
    variant: 'success' as const,
    icon: 'favorite',
    className: '',
    ariaLabel: 'Cruelty free',
  },
  'paraben-free': {
    variant: 'info' as const,
    icon: 'check_circle',
    className: '',
    ariaLabel: 'Paraben free',
  },
};

export const ProductBadge: React.FC<ProductBadgeProps> = ({ badge, compact = false }) => {
  const config = badgeConfig[badge.type];

  if (compact) {
    return (
      <Badge variant={config.variant} size="sm" aria-label={config.ariaLabel}>
        <span className="material-symbols-rounded text-sm">{config.icon}</span>
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} size="sm" aria-label={config.ariaLabel}>
      <span className="material-symbols-rounded text-sm mr-1">{config.icon}</span>
      {badge.text || badge.type.charAt(0).toUpperCase() + badge.type.slice(1).replace('-', ' ')}
    </Badge>
  );
};
