import React from 'react';

export const MissionSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <span className="material-symbols-rounded text-6xl text-primary">eco</span>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl text-gray-900 dark:text-white mb-8">
          Our Mission
        </h2>
        <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 font-sans max-w-3xl mx-auto">
          <p>
            At Noura's Butterflies, we believe that beauty should never come at the cost of our
            planet or its creatures. Our mission is to create luxurious, effective skincare that
            harnesses the power of nature while respecting all living beings.
          </p>
          <p>
            Every product is carefully crafted with vegan ingredients, cruelty-free practices, and
            sustainable packaging, ensuring that your beauty routine contributes to a more
            compassionate and beautiful world.
          </p>
        </div>
      </div>
    </section>
  );
};
