import React from 'react';

interface CategoryPillsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-soft-pink/30 dark:bg-soft-pink/10 rounded-full border border-primary/20 p-2 mb-12">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x md:flex-wrap md:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-3 rounded-full font-medium text-sm whitespace-nowrap snap-center transition-all duration-200 min-h-[44px] ${
              activeCategory === category
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-[#3d3a37] hover:bg-white/80 text-gray-700 dark:text-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
