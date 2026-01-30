import React from 'react';

export const RewardsHero: React.FC = () => {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-primary/10 to-accent-gold/10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
        <span className="material-symbols-rounded text-[300px] text-primary">flutter_dash</span>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-6">
          Your Journey to Radiant Rewards
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 italic max-w-2xl mx-auto">
          Every purchase brings you closer to exclusive benefits and luxurious rewards designed to
          celebrate your commitment to conscious beauty.
        </p>
      </div>
    </section>
  );
};
