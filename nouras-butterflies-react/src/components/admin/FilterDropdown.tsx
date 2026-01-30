import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface FilterOption {
  label: string;
  value: string;
  checked?: boolean;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  onApply: (selectedValues: string[]) => void;
  onReset?: () => void;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  onApply,
  onReset,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(options.filter((opt) => opt.checked).map((opt) => opt.value))
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (value: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedOptions(newSelected);
  };

  const handleApply = () => {
    onApply(Array.from(selectedOptions));
    setIsOpen(false);
  };

  const handleReset = () => {
    setSelectedOptions(new Set());
    onReset?.();
    setIsOpen(false);
  };

  const activeCount = selectedOptions.size;

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <span>{title}</span>
        {activeCount > 0 && (
          <span className="px-2 py-1 text-xs bg-admin-primary text-white rounded-full">
            {activeCount}
          </span>
        )}
        <span className="material-symbols-outlined text-sm">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          </div>

          {/* Options */}
          <div className="max-h-64 overflow-y-auto p-4">
            <div className="space-y-2">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.has(option.value)}
                    onChange={() => handleToggleOption(option.value)}
                    className="w-4 h-4 text-admin-primary border-gray-300 rounded focus:ring-admin-primary focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 text-sm bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
