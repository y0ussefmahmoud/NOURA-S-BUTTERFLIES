import React from 'react';
import { Card } from '../../ui';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  return (
    <Card
      ref={ref}
      className={`p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <span className="material-symbols-rounded text-3xl text-primary">{icon}</span>
      </div>
      <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </Card>
  );
};

export const ValuesGrid: React.FC = () => {
  const values = [
    {
      icon: 'energy_savings_leaf',
      title: '100% Vegan',
      description:
        'All our products are formulated with plant-based ingredients, never tested on animals.',
    },
    {
      icon: 'pets',
      title: 'Cruelty-Free',
      description:
        'We are proudly certified cruelty-free, ensuring no animals are harmed in our process.',
    },
    {
      icon: 'spa',
      title: 'Natural Ingredients',
      description:
        'We use only the finest natural ingredients, sourced sustainably from around the world.',
    },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-gray-900 dark:text-white text-center mb-16">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <ValueCard key={index} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
};
