import React, { useState } from 'react';
import { Input, Button } from '../../ui';

export const FAQHero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Topics');

  const categories = ['All Topics', 'Orders & Shipping', 'Product Info', 'Returns'];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-primary/5 to-accent-gold/5">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 dark:text-white mb-8">
          How can we help you?
        </h1>

        <div className="max-w-2xl mx-auto mb-12">
          <Input
            type="search"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="text-center"
            icon="search"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'primary' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
