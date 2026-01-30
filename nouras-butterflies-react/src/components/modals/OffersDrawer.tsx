import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockOffers } from '../../data/mockOffers';
import type { Offer } from '../../data/mockOffers';

export interface OffersDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const OffersDrawer: React.FC<OffersDrawerProps> = ({ open, onClose }) => {
  const handleOfferClick = (offer: Offer) => {
    if (offer.ctaLink) {
      window.location.href = offer.ctaLink;
    }
    onClose();
  };

  const handleClearAll = () => {
    // In a real app, this would clear all offers/dismiss them
    console.log('Clear all offers');
  };

  const getOfferCardStyles = (type: Offer['type']) => {
    switch (type) {
      case 'promo':
        return 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-800';
      case 'restock':
        return 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800';
      case 'shipping':
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
      case 'reward':
        return 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getBadgeVariant = (type: Offer['type']) => {
    switch (type) {
      case 'promo':
        return 'error' as const;
      case 'restock':
        return 'new' as const;
      case 'shipping':
        return 'success' as const;
      case 'reward':
        return 'gold' as const;
      default:
        return 'primary' as const;
    }
  };

  return (
    <Drawer open={open} onClose={onClose} position="right" width="480px">
      <Drawer.Header>
        <h2 className="text-xl font-bold text-text-dark dark:text-text-light">Current Offers</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear All
          </Button>
        </div>
      </Drawer.Header>

      <Drawer.Body>
        <div className="space-y-4">
          {mockOffers
            .filter((offer) => offer.isActive)
            .map((offer) => (
              <div
                key={offer.id}
                className={`relative rounded-lg border p-4 transition-all duration-200 hover:shadow-lg cursor-pointer ${getOfferCardStyles(
                  offer.type
                )}`}
                onClick={() => handleOfferClick(offer)}
              >
                {/* Badge */}
                {offer.badge && (
                  <div className="absolute top-3 right-3">
                    <Badge variant={getBadgeVariant(offer.type)} size="sm">
                      {offer.badge}
                    </Badge>
                  </div>
                )}

                {/* Decorative butterfly icon */}
                <div className="absolute top-3 right-12 opacity-20">
                  <span className="material-symbols-outlined text-[#C8A962]">flutter_dash</span>
                </div>

                <div className="flex gap-4">
                  {/* Offer Image */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Offer Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-dark dark:text-text-light mb-1 pr-16">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {offer.description}
                    </p>

                    {/* Valid until date */}
                    {offer.validUntil && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                        Valid until {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                    )}

                    {/* CTA Button */}
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs px-3 py-1.5 bg-[#C8A962] hover:bg-[#c8a95f]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOfferClick(offer);
                      }}
                    >
                      {offer.cta}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Empty state */}
        {mockOffers.filter((offer) => offer.isActive).length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">
                local_offer
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Active Offers
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back later for new promotions and special deals.
            </p>
          </div>
        )}
      </Drawer.Body>

      <Drawer.Footer>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (window.location.href = '/notification-settings')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-2"
        >
          <span>Notification Settings</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Button>
      </Drawer.Footer>
    </Drawer>
  );
};

OffersDrawer.displayName = 'OffersDrawer';
