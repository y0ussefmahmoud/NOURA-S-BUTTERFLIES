import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { Icon } from './Icon';
import { saudiCities } from '../../data/saudiCities';

interface AddressSuggestion {
  id: string;
  label: string;
  city?: string;
  postalCode?: string;
  country?: string;
  source?: 'recent' | 'local' | 'api';
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: {
    address: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputId?: string;
}

const RECENT_ADDRESSES_KEY = 'recent_addresses';

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className={
            part.toLowerCase() === query.toLowerCase() ? 'text-primary font-semibold' : undefined
          }
        >
          {part}
        </span>
      ))}
    </>
  );
};

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled = false,
  className,
  inputId,
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const recentAddresses = useMemo<AddressSuggestion[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(RECENT_ADDRESSES_KEY);
      const parsed = raw ? (JSON.parse(raw) as AddressSuggestion[]) : [];
      return parsed.map((item) => ({ ...item, source: 'recent' }));
    } catch {
      return [];
    }
  }, []);

  const localSuggestions = useMemo<AddressSuggestion[]>(() => {
    if (!query.trim()) return [];
    const cityMatches = saudiCities
      .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map((city, index) => ({
        id: `local-${index}-${city}`,
        label: `${city}, Saudi Arabia`,
        city,
        country: 'Saudi Arabia',
        source: 'local' as const,
      }));
    return cityMatches;
  }, [query]);

  const suggestions = useMemo(() => {
    const merged = [...recentAddresses, ...localSuggestions];
    const unique = new Map<string, AddressSuggestion>();
    merged.forEach((item) => unique.set(item.label, item));
    return Array.from(unique.values()).slice(0, 6);
  }, [recentAddresses, localSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setQuery(nextValue);
    onChange(nextValue);
    setIsOpen(true);
    setHighlightedIndex(0);

    if (nextValue.trim().length > 2) {
      setIsLoading(true);
      window.setTimeout(() => setIsLoading(false), 400);
    }
  };

  const storeRecentAddress = useCallback((suggestion: AddressSuggestion) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(RECENT_ADDRESSES_KEY);
      const parsed = raw ? (JSON.parse(raw) as AddressSuggestion[]) : [];
      const next = [suggestion, ...parsed.filter((item) => item.label !== suggestion.label)].slice(
        0,
        5
      );
      localStorage.setItem(RECENT_ADDRESSES_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.label);
    onSelect?.({
      address: suggestion.label,
      city: suggestion.city,
      postalCode: suggestion.postalCode,
      country: suggestion.country,
    });
    storeRecentAddress(suggestion);
    setQuery(suggestion.label);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (event.key === 'Enter' && suggestions[highlightedIndex]) {
      event.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const suggestionLabel = (suggestion: AddressSuggestion) => {
    if (suggestion.source === 'recent') return 'Recent address';
    if (suggestion.source === 'local') return 'City suggestion';
    return 'Suggestion';
  };

  const emptyState = !isLoading && query.trim().length > 2 && suggestions.length === 0;

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full rounded-xl border border-border-light bg-white px-6 py-4 text-base text-text-dark',
            'focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-100'
          )}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${inputId}-listbox`}
          role="combobox"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
          <Icon
            name={isLoading ? 'refresh' : 'location_on'}
            size="sm"
            className={isLoading ? 'animate-spin' : ''}
          />
        </span>
      </div>

      {isOpen && (suggestions.length > 0 || emptyState) && (
        <ul
          id={`${inputId}-listbox`}
          role="listbox"
          className="absolute z-20 mt-2 w-full rounded-xl border border-accent-pink/20 bg-white shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              role="option"
              aria-selected={highlightedIndex === index}
              className={cn(
                'flex items-center justify-between px-4 py-3 text-sm cursor-pointer',
                highlightedIndex === index ? 'bg-accent-pink/20' : 'hover:bg-accent-pink/10'
              )}
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(suggestion);
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-primary">📍</span>
                <div>
                  <div className="font-medium text-text-dark">
                    {highlightMatch(suggestion.label, query)}
                  </div>
                  <div className="text-xs text-text-muted">{suggestionLabel(suggestion)}</div>
                </div>
              </div>
            </li>
          ))}
          {emptyState && <li className="px-4 py-3 text-sm text-text-muted">No suggestions yet.</li>}
        </ul>
      )}
    </div>
  );
};
