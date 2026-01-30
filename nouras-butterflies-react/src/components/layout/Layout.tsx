import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { Breadcrumbs } from './Breadcrumbs';
import { ProgressStepper } from './ProgressStepper';
import { useLanguage } from '../../hooks/useLanguage';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Step {
  id: string;
  label: string;
  icon: string;
}

interface LayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: BreadcrumbItem[];
  showProgressStepper?: boolean;
  progressSteps?: Step[];
  currentStep?: number;
  cartItemCount?: number;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showBreadcrumbs = false,
  breadcrumbItems = [],
  showProgressStepper = false,
  progressSteps = [],
  currentStep = 0,
  cartItemCount = 0,
  className = '',
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { language, toggleLanguage, isRTL } = useLanguage();
  const direction = isRTL ? 'rtl' : 'ltr';

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    if (lang !== language) {
      toggleLanguage();
    }
  };

  const handleSearchSubmit = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  const handleNewsletterSubmit = (email: string) => {
    console.log('Newsletter signup:', email);
    // Implement newsletter signup
  };

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <div
      className={`min-h-screen bg-background-light dark:bg-background-dark ${className}`}
      dir={direction}
    >
      {/* Header */}
      <Header
        cartItemCount={cartItemCount}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onSearchSubmit={handleSearchSubmit}
        onMobileMenuToggle={toggleMobileNav}
      />

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
        cartItemCount={cartItemCount}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Content */}
      <main className="min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          {/* Breadcrumbs */}
          {showBreadcrumbs && breadcrumbItems.length > 0 && <Breadcrumbs items={breadcrumbItems} />}

          {/* Progress Stepper */}
          {showProgressStepper && progressSteps.length > 0 && (
            <ProgressStepper steps={progressSteps} currentStep={currentStep} />
          )}

          {/* Page Content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer onNewsletterSubmit={handleNewsletterSubmit} />
    </div>
  );
};

export default Layout;
