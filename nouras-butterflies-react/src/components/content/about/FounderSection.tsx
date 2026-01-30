import React from 'react';
import { Button } from '../../ui';

export const FounderSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-primary/5 dark:bg-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img
                src="/api/placeholder/600/600"
                alt="Noura, Founder of Noura's Butterflies"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute -top-4 -right-4 text-6xl text-primary/20">
              <span className="material-symbols-rounded">format_quote</span>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl text-gray-900 dark:text-white">
              Meet Our Founder
            </h2>
            <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
              <p>
                Noura's journey began with a simple question: "Why can't luxury skincare be both
                effective and ethical?" After years of research and formulation, she created Noura's
                Butterflies—a brand that proves compassion and luxury can coexist beautifully.
              </p>
              <p>
                "Every butterfly that graces our packaging represents a promise: promise to our
                customers, to animals, and to our planet. We're not just selling skincare; we're
                sharing a philosophy of conscious beauty."
              </p>
            </div>
            <Button variant="primary" className="inline-flex items-center gap-2">
              Read Her Journal
              <span className="material-symbols-rounded text-sm">arrow_forward</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
