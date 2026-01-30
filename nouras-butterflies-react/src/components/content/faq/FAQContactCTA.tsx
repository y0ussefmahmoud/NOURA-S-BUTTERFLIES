import React from 'react';
import { Button } from '../../ui';

export const FAQContactCTA: React.FC = () => {
  return (
    <section className="relative py-24 px-6 bg-[#171213] overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Still have questions?</h2>

        <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
          Our customer care team is here to help you with any questions about our products, orders,
          or anything else related to your Noura's Butterflies experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            variant="primary"
            className="bg-white text-gray-900 hover:bg-gray-100 inline-flex items-center gap-2"
          >
            Email Us
            <span className="material-symbols-rounded">mail</span>
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900 inline-flex items-center gap-2"
          >
            Live Chat
            <span className="material-symbols-rounded">chat</span>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <a href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="/cookies" className="hover:text-white transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </section>
  );
};
