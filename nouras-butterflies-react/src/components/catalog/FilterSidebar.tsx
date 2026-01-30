import React from 'react';
import type { FilterState } from '../../types/catalog';
import { categoryOptions, philosophyOptions } from '../../data/filterOptions';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
  disabled?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  className = '',
  disabled = false,
}) => {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);

    onFilterChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handlePhilosophyChange = (philosophyId: string, active: boolean) => {
    const newPhilosophies = active
      ? [...filters.philosophies, philosophyId]
      : filters.philosophies.filter((id) => id !== philosophyId);

    onFilterChange({
      ...filters,
      philosophies: newPhilosophies,
    });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange.current] as [number, number];
    newPriceRange[index] = value;

    // Prevent crossover: ensure min <= max
    if (index === 0 && newPriceRange[0] > newPriceRange[1]) {
      newPriceRange[0] = newPriceRange[1];
    } else if (index === 1 && newPriceRange[1] < newPriceRange[0]) {
      newPriceRange[1] = newPriceRange[0];
    }

    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        current: newPriceRange,
      },
    });
  };

  return (
    <div
      className={`hidden lg:block sticky top-28 flex flex-col gap-6 ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Category Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base">Categories</h3>
        <div className="space-y-3">
          {categoryOptions.map((category) => (
            <label
              key={category.id}
              className="flex items-center justify-between cursor-pointer group min-h-[44px] px-2 -mx-2 rounded-lg hover:bg-accent-pink/5"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-5 h-5">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                  />
                </div>
                <span className="group-hover:text-primary transition-colors text-sm">
                  {category.name}
                </span>
              </div>
              <span className="text-sm opacity-60">({category.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base">Philosophy</h3>
        <div className="flex flex-wrap gap-2">
          {philosophyOptions.map((philosophy) => (
            <button
              key={philosophy.id}
              onClick={() =>
                handlePhilosophyChange(philosophy.id, !filters.philosophies.includes(philosophy.id))
              }
              className={`min-h-[44px] px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                filters.philosophies.includes(philosophy.id)
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-foreground-light/70 dark:text-foreground-dark/70 hover:border-primary/40'
              }`}
            >
              <span className="material-symbols-rounded text-sm mr-1">{philosophy.icon}</span>
              {philosophy.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-base">Price Range</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange.current[0]}</span>
            <span>${filters.priceRange.current[1]}+</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={filters.priceRange.min}
              max={filters.priceRange.max}
              value={filters.priceRange.current[0]}
              onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value))}
              className="w-full h-1 bg-primary/30 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <input
              type="range"
              min={filters.priceRange.min}
              max={filters.priceRange.max}
              value={filters.priceRange.current[1]}
              onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value))}
              className="w-full h-1 bg-primary/30 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-3 border-2 border-dashed border-[#eacdd2] rounded-lg text-center hover:border-primary hover:text-primary transition-colors tracking-widest text-sm uppercase"
      >
        Reset Filters
      </button>
    </div>
  );
};
