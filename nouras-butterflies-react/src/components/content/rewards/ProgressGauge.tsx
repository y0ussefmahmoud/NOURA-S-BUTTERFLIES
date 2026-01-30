import React from 'react';
import { Card } from '../../ui';

export const ProgressGauge: React.FC = () => {
  return (
    <Card className="lg:col-span-2 p-8 bg-white dark:bg-background-dark/50 border border-primary/20">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-2">Satin Wings</h3>
            <p className="text-primary font-medium">Metamorphosing</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">750</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">points</div>
          </div>
        </div>

        <div className="relative">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent-gold rounded-full relative shimmer-effect"
              style={{ width: '75%' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>

          <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>SILK</span>
            <span>VELVET</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">250 points</span> to Velvet Wings tier
          </p>
        </div>
      </div>
    </Card>
  );
};
