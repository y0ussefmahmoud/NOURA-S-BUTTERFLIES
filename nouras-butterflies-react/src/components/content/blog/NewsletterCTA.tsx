import React, { useState } from 'react';
import { Button, Input } from '../../ui';

export const NewsletterCTA: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="relative py-24 px-6 bg-[#FDF9F6] dark:bg-[#3d3a37] border-2 border-primary/10">
      <div className="absolute top-8 left-8 opacity-15 pointer-events-none">
        <span className="material-symbols-rounded text-6xl text-primary">flutter_dash</span>
      </div>
      <div className="absolute bottom-8 right-8 opacity-15 pointer-events-none">
        <span className="material-symbols-rounded text-6xl text-primary">flutter_dash</span>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">
          Stay Connected to Nature's Beauty
        </h2>

        <p className="text-sm uppercase tracking-widest text-primary mb-8">Natural. Vegan. Kind.</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" variant="primary">
            Subscribe
          </Button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Join our community for exclusive tips, new product launches, and special offers.
        </p>
      </div>
    </section>
  );
};
