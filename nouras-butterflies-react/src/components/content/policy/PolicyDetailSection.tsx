import React from 'react';
import { Button } from '../../ui';

export const PolicyDetailSection: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-primary/5 dark:bg-primary/10 border-y border-primary/20">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-6">Shipping Fees</h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 mb-8">
            <p>
              <strong>Free shipping</strong> on orders over 200 AED within the UAE and KSA. Standard
              shipping rates apply for orders below this threshold and international deliveries.
            </p>
            <p>
              Express shipping options are available at checkout for urgent deliveries. Same-day
              delivery is available in Dubai for orders placed before 12 PM.
            </p>
          </div>

          <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-6">Damaged Items</h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-300 mb-12">
            <p>
              In the unlikely event that your order arrives damaged, please contact us within 48
              hours of delivery with photos of the damaged product and packaging.
            </p>
            <p>
              We will arrange for a free replacement and, if necessary, collection of the damaged
              item. No additional shipping charges will apply for replacement orders.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
          <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-4">Need Help?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Our customer care team is ready to assist with any questions about shipping, returns, or
            any other concerns you may have.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" className="inline-flex items-center gap-2">
              Contact Us
              <span className="material-symbols-rounded text-sm">mail</span>
            </Button>
            <Button variant="outline" className="inline-flex items-center gap-2">
              Read FAQs
              <span className="material-symbols-rounded text-sm">help</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
