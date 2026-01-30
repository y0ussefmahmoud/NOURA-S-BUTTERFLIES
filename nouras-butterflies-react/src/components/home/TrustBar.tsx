import React from 'react';
import { Icon } from '../ui/Icon';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: 'local_shipping',
    title: 'Free Shipping',
    description: 'On orders over $50',
  },
  {
    icon: 'eco',
    title: '100% Organic',
    description: 'Natural ingredients only',
  },
  {
    icon: 'lock_open',
    title: 'Secure Payment',
    description: 'Protected transactions',
  },
];

export const TrustBar: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 gap-8 md:grid-cols-3 ${
            isVisible ? 'animate-fadeInUp' : 'opacity-0'
          }`}
        >
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center md:items-start md:text-left lg:flex-row lg:items-center lg:gap-4"
            >
              {/* Icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200 lg:mb-0 lg:h-20 lg:w-20">
                <Icon
                  name={badge.icon}
                  className="h-8 w-8 text-primary-600 lg:h-10 lg:w-10"
                  size="xl"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 lg:text-xl">
                  {badge.title}
                </h3>
                <p className="text-sm text-gray-600 lg:text-base">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Border separators for desktop */}
        <div className="mt-8 hidden md:block">
          <div className="grid grid-cols-3 gap-0">
            <div className="border-r border-gray-200" />
            <div className="border-r border-gray-200" />
            <div />
          </div>
        </div>
      </div>
    </section>
  );
};
