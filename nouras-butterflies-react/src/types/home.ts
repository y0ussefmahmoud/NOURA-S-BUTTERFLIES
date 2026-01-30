// TypeScript interfaces for homepage components

export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface HeroSectionProps {
  className?: string;
}

export interface TrustBarProps {
  badges?: TrustBadge[];
  className?: string;
}

export interface BestSellersSectionProps {
  products?: any[];
  className?: string;
}

export interface BrandPhilosophySectionProps {
  features?: FeatureItem[];
  className?: string;
}

export interface NewsletterSectionProps {
  className?: string;
  onSubmit?: (email: string) => void;
}

export interface ButterflyDecorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface ButterflySwarmProps {
  count?: number;
  className?: string;
}

// Animation related types
export interface AnimationOptions {
  duration?: string;
  delay?: string;
  easing?: string;
}

export interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  root?: Element | null;
}

export interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>;
  isVisible: boolean;
}

export interface UseMultipleIntersectionObserverReturn {
  refs: React.RefObject<Element>[];
  visibleStates: boolean[];
  setRef: (index: number) => (el: Element | null) => void;
}

// Homepage section data types
export interface HeroSectionData {
  title: string;
  subtitle: string;
  description: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  badge: {
    text: string;
    icon: string;
  };
  imageUrl: string;
  imageAlt: string;
}

export interface TrustBarData {
  badges: TrustBadge[];
}

export interface BestSellersData {
  title: string;
  subtitle: string;
  viewAllText: string;
  viewAllHref: string;
  products: any[];
}

export interface BrandPhilosophyData {
  title: string;
  subtitle: string;
  description: string;
  features: FeatureItem[];
  cta: {
    text: string;
    href: string;
  };
  images: {
    url: string;
    alt: string;
  }[];
}

export interface NewsletterData {
  title: string;
  description: string;
  placeholder: string;
  submitText: string;
  successMessage: string;
  errorMessage: string;
  privacyText: string;
}

// All types are already exported with their interface declarations
