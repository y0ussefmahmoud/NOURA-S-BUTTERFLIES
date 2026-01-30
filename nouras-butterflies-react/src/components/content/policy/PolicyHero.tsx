import React from 'react';

export const PolicyHero: React.FC = () => {
  return (
    <section className="relative min-h-[320px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/api/placeholder/1920/600"
          alt="Shipping and returns background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
      </div>

      <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 luxury-shadow">
          Shipping & Returns
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Everything you need to know about getting your Noura's Butterflies products delivered
          safely and our hassle-free return policy.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <nav className="flex items-center gap-2 text-white/80 text-sm">
          <a href="/" className="hover:text-white transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-white">Policy</span>
        </nav>
      </div>
    </section>
  );
};
