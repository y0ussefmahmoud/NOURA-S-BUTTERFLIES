import React from 'react';
import {
  RewardsHero,
  ProgressGauge,
  StatsCards,
  EarnCard,
  RewardCard,
} from '../components/content/rewards';

const RewardsPage: React.FC = () => {
  const earnActivities = [
    {
      icon: 'shopping_bag',
      title: 'Make a Purchase',
      description: 'Earn 1 point for every AED 1 spent',
      points: '1 pt per AED',
    },
    {
      icon: 'cake',
      title: 'Birthday Bonus',
      description: 'Receive 50 bonus points on your birthday',
      points: '50 pts',
    },
    {
      icon: 'rate_review',
      title: 'Write a Review',
      description: 'Share your experience and earn points',
      points: '25 pts',
    },
    {
      icon: 'share',
      title: 'Refer a Friend',
      description: 'Get 100 points when your friend makes their first purchase',
      points: '100 pts',
    },
  ];

  const availableRewards = [
    {
      title: 'Free Shipping',
      description: 'Complimentary shipping on your next order',
      points: '100',
      locked: false,
    },
    {
      title: '15% Off Coupon',
      description: 'Get 15% off your entire purchase',
      points: '200',
      locked: false,
    },
    {
      title: 'Free Mini Facial',
      description: 'Complimentary 30-minute facial at our Dubai showroom',
      points: '500',
      locked: false,
    },
    {
      title: 'Exclusive Product Access',
      description: 'Early access to new product launches',
      points: '1000',
      locked: true,
    },
    {
      title: 'VIP Event Invitation',
      description: 'Exclusive invitation to our annual beauty event',
      points: '1500',
      locked: true,
    },
    {
      title: 'Personal Consultation',
      description: 'One-on-one skincare consultation with our experts',
      points: '2000',
      locked: true,
    },
  ];

  return (
    <main className="butterfly-bg">
      <RewardsHero />

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            <ProgressGauge />
            <StatsCards />
          </div>

          <div className="mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white text-center mb-12">
              Ways to Earn
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {earnActivities.map((activity, index) => (
                <EarnCard key={index} {...activity} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white text-center mb-12">
              Available Rewards
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRewards.map((reward, index) => (
                <RewardCard
                  key={index}
                  {...reward}
                  onClaim={() => console.log(`Claiming: ${reward.title}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RewardsPage;
