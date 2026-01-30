import React from 'react';

export interface TrendingSearchesProps {
  onSearchClick: (query: string) => void;
}

const trendingSearches = [
  '#hydrating',
  '#vegan',
  '#crueltyfree',
  '#lipglow',
  '#naturalglow',
  '#butterflyrewards',
  '#bestseller',
  '#newarrival',
];

export const TrendingSearches: React.FC<TrendingSearchesProps> = ({ onSearchClick }) => {
  const handleSearchClick = (search: string) => {
    // Remove # and clean up the search term
    const cleanQuery = search
      .replace('#', '')
      .replace(/([A-Z])/g, ' $1')
      .trim();
    onSearchClick(cleanQuery);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-dark dark:text-text-light mb-3">
        Trending Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {trendingSearches.map((search) => (
          <button
            key={search}
            onClick={() => handleSearchClick(search)}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#C8A962] hover:text-[#C8A962] rounded-full text-sm transition-colors duration-200"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

TrendingSearches.displayName = 'TrendingSearches';
