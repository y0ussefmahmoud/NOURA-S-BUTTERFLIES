import React, { useState, useRef, useEffect } from 'react';
import type { SortOption, SortOptionConfig } from '../../types/catalog';
import { sortOptions } from '../../data/filterOptions';

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
  options?: SortOptionConfig[];
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  options = sortOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#eacdd2] hover:bg-white dark:hover:bg-black/20 transition-colors"
      >
        <span className="text-sm">{currentOption?.label || 'Sort'}</span>
        <span className="material-symbols-rounded text-sm">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-black border border-[#eacdd2] dark:border-[#3d322d] rounded-lg shadow-lg z-50 min-w-[200px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === option.value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-gray-50 dark:hover:bg-black/20'
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
