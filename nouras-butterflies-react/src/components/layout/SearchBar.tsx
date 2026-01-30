import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
  className?: string;
  variant?: 'desktop' | 'mobile';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search products...',
  onSearch,
  suggestions = [],
  className = '',
  variant = 'desktop',
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query && suggestions.length > 0) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [query, suggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const baseClasses = variant === 'desktop' ? 'max-w-xs w-full' : 'w-full';

  const inputClasses =
    variant === 'desktop'
      ? 'pl-10 pr-4 py-2 rounded-full bg-accent-pink dark:bg-surface-dark border-none'
      : 'pl-10 pr-4 py-3 rounded-lg bg-accent-pink dark:bg-surface-dark border-none';

  return (
    <div ref={searchRef} className={`relative ${baseClasses} ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-light/50 dark:text-foreground-dark/50"
          />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
            className={inputClasses}
          />
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <ul className="py-2">
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 transition-colors text-foreground-light dark:text-foreground-dark text-sm"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
