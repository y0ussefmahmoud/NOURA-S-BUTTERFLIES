import React from 'react';
import { Card } from '../../ui';

export const StatsCards: React.FC = () => {
  const stats = [
    {
      icon: 'payments',
      label: 'Total Points',
      value: '750',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
    },
    {
      icon: 'redeem',
      label: 'Rewards Ready',
      value: '3',
      bgColor: 'bg-white dark:bg-gray-800',
      textColor: 'text-gray-900 dark:text-white',
    },
    {
      icon: 'group_add',
      label: 'Referrals',
      value: '12',
      bgColor: 'bg-white dark:bg-gray-800',
      textColor: 'text-gray-900 dark:text-white',
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`p-6 ${stat.bgColor} border border-gray-200 dark:border-gray-700`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <span className="material-symbols-rounded text-xl">{stat.icon}</span>
            </div>
            <div className={`text-sm font-medium ${stat.textColor}`}>{stat.label}</div>
          </div>
          <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
        </Card>
      ))}
    </>
  );
};
