import React from 'react';
import { cn } from '../../utils/cn';

interface CartSkeletonProps {
  className?: string;
  showOrderSummary?: boolean;
}

export const CartSkeleton: React.FC<CartSkeletonProps> = ({
  className,
  showOrderSummary = true,
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-8 space-y-4">
          {/* Skeleton Item 1 */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Image Skeleton */}
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />

              {/* Content Skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />

                {/* Quantity Controls Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>

              {/* Price Skeleton */}
              <div className="text-right">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" />
              </div>
            </div>
          </div>

          {/* Skeleton Item 2 */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" />
              </div>
            </div>
          </div>

          {/* Trust Badges Skeleton */}
          <div className="flex justify-center gap-6 pt-4">
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* Order Summary Skeleton */}
        {showOrderSummary && (
          <div className="lg:col-span-4">
            <div className="bg-[#f2efe9] dark:bg-surface-dark rounded-xl border border-primary p-6 sticky top-32">
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6" />

              {/* Price Breakdown Skeleton */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
                <div className="border-t border-primary/30 pt-3">
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  </div>
                </div>
              </div>

              {/* Promo Code Skeleton */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              </div>

              {/* Button Skeleton */}
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />

              {/* Trust Badge Skeleton */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>

              {/* Quote Skeleton */}
              <div className="mt-4 p-4 border-2 border-dashed border-primary/30 rounded-lg">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CartSkeleton.displayName = 'CartSkeleton';
