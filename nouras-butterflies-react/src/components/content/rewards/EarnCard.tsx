import React from 'react';
import { Card } from '../../ui';

interface EarnCardProps {
  icon: string;
  title: string;
  description: string;
  points: string;
}

export const EarnCard: React.FC<EarnCardProps> = ({ icon, title, description, points }) => {
  return (
    <Card className="p-6 hover:border-primary/50 transition-colors duration-200 group">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center flex-shrink-0 group-hover:scale-105 duration-200">
          <span className="material-symbols-rounded text-2xl text-primary">{icon}</span>
        </div>

        <div className="flex-1">
          <h3 className="font-serif text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            <span className="material-symbols-rounded text-sm">stars</span>
            {points}
          </div>
        </div>
      </div>
    </Card>
  );
};
