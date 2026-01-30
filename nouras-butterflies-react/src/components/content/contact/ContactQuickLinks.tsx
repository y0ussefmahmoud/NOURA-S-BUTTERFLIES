import React from 'react';
import { Card } from '../../ui';

export const ContactQuickLinks: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-12">
      <Card className="p-6 bg-primary/20 border-primary/30 hover:translate-y-[-4px] transition-transform duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-rounded text-primary">help</span>
          </div>
          <div>
            <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Find quick answers to common questions about our products, shipping, and returns.
            </p>
            <a
              href="/faq"
              className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-all duration-200"
            >
              Browse FAQs
              <span className="material-symbols-rounded text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-accent-gold/10 border-accent-gold/30 hover:translate-y-[-4px] transition-transform duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-rounded text-accent-gold">location_on</span>
          </div>
          <div>
            <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-2">
              Visit Our Showroom
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Experience our products in person at our Dubai showroom. Book a consultation today.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Dubai, UAE</p>
              <p>Sat-Thu: 10AM-7PM GST</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
