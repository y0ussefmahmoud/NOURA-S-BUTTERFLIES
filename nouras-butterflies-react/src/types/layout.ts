// Header Component Types
export interface HeaderProps {
  cartItemCount?: number;
  currentLanguage?: 'en' | 'ar';
  onLanguageChange?: (lang: 'en' | 'ar') => void;
  onSearchSubmit?: (query: string) => void;
  className?: string;
}

// Mobile Navigation Component Types
export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemCount?: number;
  currentLanguage?: 'en' | 'ar';
  onLanguageChange?: (lang: 'en' | 'ar') => void;
}

// Footer Component Types
export interface FooterProps {
  onNewsletterSubmit?: (email: string) => void;
  className?: string;
}

// Breadcrumbs Component Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Progress Stepper Component Types
export interface Step {
  id: string;
  label: string;
  icon: string;
}

export interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

// Search Bar Component Types
export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
  className?: string;
  variant?: 'desktop' | 'mobile';
}

// Layout Component Types
export interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: BreadcrumbItem[];
  showProgressStepper?: boolean;
  progressSteps?: Step[];
  currentStep?: number;
  cartItemCount?: number;
  className?: string;
}

// Language Hook Types
export type Language = 'en' | 'ar';

export interface UseLanguageReturn {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
}

// Scroll Direction Hook Types
export interface UseScrollDirectionReturn {
  scrollDirection: 'up' | 'down';
  isScrolled: boolean;
  shouldHideHeader: boolean;
}

// Navigation Item Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}

// Social Link Types
export interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

// Newsletter Form Types
export interface NewsletterData {
  email: string;
}

// Search Suggestion Types
export interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  url?: string;
}
