import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { SearchBar } from './SearchBar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  cartItemCount?: number;
  currentLanguage?: 'en' | 'ar';
  onLanguageChange?: (lang: 'en' | 'ar') => void;
  onSearchSubmit?: (query: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  cartItemCount = 0,
  currentLanguage = 'en',
  onLanguageChange,
  onSearchSubmit,
}) => {
  const { t } = useTranslation('navigation');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLanguageToggle = () => {
    if (onLanguageChange) {
      onLanguageChange(currentLanguage === 'en' ? 'ar' : 'en');
      // Haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  // Swipe to close functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStartX(touch.clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartX;
    const isRTL = currentLanguage === 'ar';

    // Only allow swipe in the closing direction
    if ((!isRTL && deltaX > 0) || (isRTL && deltaX < 0)) {
      setDragOffset(Math.abs(deltaX));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 100; // Minimum drag distance to close
    const velocity = dragOffset / 10; // Simple velocity calculation

    if (dragOffset > threshold || velocity > 5) {
      handleClose();
    } else {
      // Spring back animation
      setDragOffset(0);
    }

    setIsDragging(false);
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onClose();
      setIsAnimating(false);
      setDragOffset(0);
    }, 300);
  };

  const navLinks = [
    { label: t('header.menu.shopAll'), href: '/shop' },
    { label: t('header.menu.newArrivals'), href: '/new-arrivals' },
    { label: t('header.menu.veganCollections'), href: '/vegan' },
    { label: t('header.menu.ourStory'), href: '/about' },
  ];

  const isRTL = currentLanguage === 'ar';

  return (
    <Modal open={isOpen} onClose={handleClose} className="p-0" overlayClassName="backdrop-blur-sm">
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          fixed top-0 h-full w-[85vw] max-w-sm bg-background-light dark:bg-background-dark 
          shadow-2xl transition-transform duration-300 ease-out z-50 pt-safe-top pb-safe-bottom
          ${isRTL ? 'left-0' : 'right-0'}
          ${isAnimating ? 'translate-x-full' : ''}
          ${isDragging && dragOffset > 0 ? (isRTL ? '-translate-x-full' : 'translate-x-full') : ''}
          ${!isAnimating && !isDragging && isOpen ? 'translate-x-0' : ''}
          ${!isOpen && !isAnimating ? 'translate-x-full' : ''}
        `}
        style={{
          transform:
            isDragging && dragOffset > 0
              ? isRTL
                ? `translateX(-${dragOffset}px)`
                : `translateX(${dragOffset}px)`
              : undefined,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity touch-target"
            onClick={handleClose}
          >
            <Icon name="flutter_dash" className="w-6 h-6 text-primary" />
            <span className="font-display text-sm font-bold text-foreground-light dark:text-foreground-dark">
              {t('header.logo')}
            </span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-3 hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 touch-target"
            aria-label="Close menu"
          >
            <Icon name="close" className="w-5 h-5" />
          </Button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Search */}
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <SearchBar variant="mobile" onSearch={onSearchSubmit} />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navLinks.map((link, index) => (
                <li
                  key={link.href}
                  style={{
                    animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none',
                  }}
                >
                  <Link
                    to={link.href}
                    onClick={handleClose}
                    className="block py-3 px-4 rounded-lg text-foreground-light dark:text-foreground-dark hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 transition-colors font-medium touch-target"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account & Actions */}
          <div className="p-4 border-t border-border-light dark:border-border-dark space-y-3">
            {/* Language Switcher */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLanguageToggle}
              className="w-full justify-center text-xs font-bold py-3 bg-accent-pink dark:bg-surface-dark hover:bg-primary/10 touch-target"
            >
              {currentLanguage === 'en' ? 'العربية' : 'English'}
            </Button>

            {/* Account Link */}
            <Link
              to="/account"
              onClick={handleClose}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 transition-colors touch-target"
            >
              <Icon name="person" className="w-5 h-5" />
              <span className="font-medium">{t('header.actions.account')}</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={handleClose}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 transition-colors touch-target"
            >
              <Icon name="favorite_border" className="w-5 h-5" />
              <span className="font-medium">{t('header.actions.wishlist')}</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              onClick={handleClose}
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors touch-target"
            >
              <Icon name="shopping_bag" className="w-5 h-5" />
              <span className="font-medium">{t('header.actions.cart')}</span>
              {cartItemCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Modal>
  );
};
