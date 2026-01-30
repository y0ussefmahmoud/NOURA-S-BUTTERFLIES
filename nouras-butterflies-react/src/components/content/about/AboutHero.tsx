import React from 'react';

export const AboutHero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent-gold/10">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="text-primary font-serif text-sm tracking-widest uppercase">
            Est. 2021
          </span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-8 leading-tight">
          Noura's Butterflies
        </h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-accent-gold mx-auto mb-8" />
        <p className="font-serif text-xl md:text-2xl text-gray-600 dark:text-gray-300 italic max-w-2xl mx-auto">
          Where nature's beauty meets conscious luxury
        </p>
      </div>
    </section>
  );
};
