import React from 'react';

export const ContactInfo: React.FC = () => {
  return (
    <div className="lg:w-5/12 p-8 lg:p-12 bg-white dark:bg-gray-900 border-r border-[#e4ddde] dark:border-gray-700">
      <div className="mb-8">
        <span className="text-primary text-sm font-medium tracking-widest uppercase">
          Get in Touch
        </span>
      </div>

      <h1 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-6">
        We'd Love to Hear From You
      </h1>

      <p className="text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
        Whether you have questions about our products, need help with an order, or just want to
        share your experience with Noura's Butterflies, our team is here to help.
      </p>

      <div className="space-y-8">
        <div>
          <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-4">
            Customer Support
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Email:</span>{' '}
              <a
                href="mailto:support@nourasbutterflies.com"
                className="text-primary font-medium inline-flex items-center gap-2 hover:gap-3 transition-all duration-200"
              >
                support@nourasbutterflies.com
                <span className="material-symbols-rounded text-sm">arrow_forward</span>
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Response Time:</span> Within 24 hours
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-4">Gulf Region</h3>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Phone:</span> +971 4 XXX XXXX
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Hours:</span> Sat-Thu, 9AM-6PM GST
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-4">Egypt Office</h3>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Phone:</span> +20 2 XXX XXXX
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Hours:</span> Sat-Thu, 9AM-5PM EET
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-6">Follow Us</h3>
        <div className="flex gap-4">
          <button className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
            <span className="material-symbols-rounded text-primary">camera</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
            <span className="material-symbols-rounded text-primary">chat</span>
          </button>
          <button className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
            <span className="material-symbols-rounded text-primary">music_note</span>
          </button>
        </div>
      </div>
    </div>
  );
};
