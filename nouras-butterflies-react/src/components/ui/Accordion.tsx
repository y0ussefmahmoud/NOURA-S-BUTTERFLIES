import React, { useState, useRef, useEffect } from 'react';

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
  allowMultiple?: boolean;
}

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

const AccordionContext = React.createContext<{
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  allowMultiple: boolean;
}>({
  openItems: new Set(),
  toggleItem: () => {},
  allowMultiple: false,
});

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className = '',
  allowMultiple = false,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(value);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  value,
  className = '',
}) => {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={`bg-white dark:bg-[#241a1c] rounded-xl border shadow-sm ${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className = '' }) => {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemContext);
  const isOpen = openItems.has(itemValue);

  const handleClick = () => {
    toggleItem(itemValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-t-xl ${className}`}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${itemValue}`}
    >
      <span className="flex items-center gap-3">
        <span className="text-primary">🦋</span>
        <span className="font-medium text-gray-900 dark:text-white">{children}</span>
      </span>
      <span
        className={`material-symbols-rounded text-gray-500 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        expand_more
      </span>
    </button>
  );
};

export const AccordionContent: React.FC<AccordionContentProps> = ({ children, className = '' }) => {
  const { openItems } = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemContext);
  const isOpen = openItems.has(itemValue);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      id={`accordion-content-${itemValue}`}
      role="region"
      className={`overflow-hidden transition-all duration-300 ease-out ${className}`}
      style={{ maxHeight: height }}
    >
      <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">{children}</div>
    </div>
  );
};

const AccordionItemContext = React.createContext<string>('');

AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = 'AccordionTrigger';
AccordionContent.displayName = 'AccordionContent';
