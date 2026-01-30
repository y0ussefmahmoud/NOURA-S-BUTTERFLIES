import React from 'react';
import { Card, Button } from '../../ui';

interface RewardCardProps {
  title: string;
  description: string;
  points: string;
  locked?: boolean;
  image?: string;
  onClaim?: () => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({
  title,
  description,
  points,
  locked = false,
  image = '/api/placeholder/300/200',
  onClaim,
}) => {
  return (
    <Card className={`overflow-hidden group ${locked ? 'opacity-75' : ''}`}>
      <div className="relative">
        <img
          src={image}
          alt={title}
          className={`w-full h-48 object-cover ${locked ? 'grayscale' : ''}`}
        />

        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
            {points} pts
          </div>
        </div>

        {locked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <span className="material-symbols-rounded text-4xl mb-2">lock</span>
              <p className="text-sm">Unlock at Velvet Wings</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>

        <Button
          variant="primary"
          onClick={onClaim}
          disabled={locked}
          className={`w-full ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} transition-transform duration-200`}
        >
          {locked ? 'Locked' : 'Claim Now'}
        </Button>
      </div>
    </Card>
  );
};
