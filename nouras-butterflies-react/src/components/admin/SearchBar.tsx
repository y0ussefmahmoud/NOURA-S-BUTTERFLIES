import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onSearch,
  className,
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(controlledValue || '');
  const [debouncedValue, setDebouncedValue] = useState('');

  // Handle controlled/uncontrolled mode
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : localValue;
  const setCurrentValue = isControlled ? onChange : setLocalValue;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(currentValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [currentValue, debounceMs]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCurrentValue?.(newValue);
  };

  const handleClear = () => {
    setCurrentValue?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(currentValue);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        search
      </span>
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all duration-200"
      />
      {currentValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </div>
  );
};
