import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { useScrollDirection } from '../../hooks/useScrollDirection';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useWishlist } from '../../hooks/useWishlist';
import { useModals } from '../../contexts/ModalsContext';
import { useRoutePrefetch } from '../../hooks/useRoutePrefetch';

interface HeaderProps {
  currentLanguage?: 'en' | 'ar';
  onLanguageChange?: (lang: 'en' | 'ar') => void;
  onMobileMenuToggle?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage = 'en',
  onLanguageChange,
  onMobileMenuToggle,
  className = '',
}) => {
  const { t } = useTranslation('navigation');
  const location = useLocation();
  const navigate = useNavigate();
  const { isScrolled, shouldHideHeader } = useScrollDirection();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const { wishlistCount } = useWishlist();
  const { openSearch, openOffersDrawer } = useModals();

  // Route prefetching for main navigation
  const { prefetchHandlers: prefetchHome } = useRoutePrefetch('home');
  const { prefetchHandlers: prefetchProducts } = useRoutePrefetch('products');
  const { prefetchHandlers: prefetchAbout } = useRoutePrefetch('about');
  const { prefetchHandlers: prefetchCart } = useRoutePrefetch('cart');
  const { prefetchHandlers: prefetchLogin } = useRoutePrefetch('login');
  const { prefetchHandlers: prefetchAccount } = useRoutePrefetch('account');
  const { prefetchHandlers: prefetchAdmin } = useRoutePrefetch('admin');

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleSearchClick = () => {
    openSearch();
  };

  const handleNotificationsClick = () => {
    openOffersDrawer();
  };

  const handleLanguageToggle = () => {
    if (onLanguageChange) {
      onLanguageChange(currentLanguage === 'en' ? 'ar' : 'en');
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    {
      label: t('header.menu.shopAll'),
      href: '/products',
      prefetchHandlers: prefetchProducts,
    },
    {
      label: t('header.menu.newArrivals'),
      href: '/new-arrivals',
      prefetchHandlers: prefetchProducts,
    },
    {
      label: t('header.menu.veganCollections'),
      href: '/vegan',
      prefetchHandlers: prefetchProducts,
    },
    {
      label: t('header.menu.ourStory'),
      href: '/about',
      prefetchHandlers: prefetchAbout,
    },
  ];

  return (
    <header
      className={`
      sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md transition-all duration-300
      ${isScrolled ? 'shadow-md' : 'shadow-sm'}
      ${shouldHideHeader ? '-translate-y-full' : 'translate-y-0'}
      ${className}
    `}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Mobile Menu Toggle - Left side */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuToggle}
          className="tablet:hidden min-w-[44px] min-h-[44px] p-3 hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 touch-target"
          aria-label="Toggle menu"
        >
          <Icon name="menu" className="w-6 h-6" />
        </Button>

        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity tablet:absolute tablet:left-1/2 tablet:transform tablet:-translate-x-1/2 touch-target"
          onMouseEnter={prefetchHome.onMouseEnter}
          onFocus={prefetchHome.onFocus}
          onMouseLeave={prefetchHome.onMouseLeave}
          onBlur={prefetchHome.onBlur}
        >
          <Icon name="flutter_dash" className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <span className="font-display text-lg md:text-xl font-bold text-foreground-light dark:text-foreground-dark">
            {t('header.logo')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden tablet:flex items-center gap-4 md:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onMouseEnter={link.prefetchHandlers.onMouseEnter}
              onFocus={link.prefetchHandlers.onFocus}
              onMouseLeave={link.prefetchHandlers.onMouseLeave}
              onBlur={link.prefetchHandlers.onBlur}
              className={`text-xs md:text-sm font-medium transition-colors hover:text-primary ${
                isActivePath(link.href)
                  ? 'text-primary'
                  : 'text-foreground-light/70 dark:text-foreground-dark/70'
              } touch-target`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions Area */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Button - Desktop Only */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearchClick}
            className="hidden md:flex min-w-[44px] min-h-[44px] p-3 items-center justify-center hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 touch-target"
            aria-label={t('header.actions.search')}
          >
            <Icon name="search" className="w-5 h-5" />
          </Button>

          {/* Notifications Button - Hidden on small mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationsClick}
            className="hidden mobile-lg:flex min-w-[44px] min-h-[44px] p-3 flex items-center justify-center hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 relative touch-target"
            aria-label={t('header.actions.notifications')}
          >
            <Icon name="notifications" className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </Button>

          {/* Language Switcher - Hidden on small mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLanguageToggle}
            className="hidden mobile-lg:flex min-w-[44px] min-h-[44px] flex items-center justify-center text-xs font-bold px-3 py-2 rounded-full bg-accent-pink dark:bg-surface-dark hover:bg-primary/10"
            aria-label={currentLanguage === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
          >
            {currentLanguage === 'en' ? 'AR' : 'EN'}
          </Button>

          {/* Authenticated User Actions */}
          {isAuthenticated && user ? (
            <>
              {/* Admin Dashboard Link - Hidden on mobile */}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin/dashboard')}
                  onMouseEnter={prefetchAdmin.onMouseEnter}
                  onFocus={prefetchAdmin.onFocus}
                  onMouseLeave={prefetchAdmin.onMouseLeave}
                  onBlur={prefetchAdmin.onBlur}
                  className="hidden md:flex min-w-[44px] min-h-[44px] p-3 flex items-center justify-center hover:bg-admin-primary/10 dark:hover:bg-surface-dark/10"
                  aria-label="Admin Dashboard"
                >
                  <Icon name="dashboard" className="w-5 h-5" />
                </Button>
              )}

              {/* Wishlist - Hidden on small mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/account/wishlist')}
                onMouseEnter={prefetchAccount.onMouseEnter}
                onFocus={prefetchAccount.onFocus}
                onMouseLeave={prefetchAccount.onMouseLeave}
                onBlur={prefetchAccount.onBlur}
                className="hidden mobile-lg:flex min-w-[44px] min-h-[44px] p-3 flex items-center justify-center hover:bg-accent-pink/10 dark:hover:bg-surface-dark/10 relative"
                aria-label={t('header.actions.wishlist')}
              >
                <Icon name="favorite_border" className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[20px] h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Button>

              {/* User Profile Dropdown */}
              <UserProfileDropdown
                user={user}
                onLogout={logout}
                onNavigate={(path) => navigate(path)}
              />
            </>
          ) : (
            // Login/Register Buttons - Hide register on mobile
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                onMouseEnter={prefetchLogin.onMouseEnter}
                onFocus={prefetchLogin.onFocus}
                onMouseLeave={prefetchLogin.onMouseLeave}
                onBlur={prefetchLogin.onBlur}
                className="min-h-[44px] text-xs font-bold px-3 py-2 rounded-full bg-accent-pink dark:bg-surface-dark hover:bg-primary/10"
              >
                {t('header.actions.login')}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login?tab=register')}
                onMouseEnter={prefetchLogin.onMouseEnter}
                onFocus={prefetchLogin.onFocus}
                onMouseLeave={prefetchLogin.onMouseLeave}
                onBlur={prefetchLogin.onBlur}
                className="hidden md:flex min-h-[44px] px-6 shadow-butterfly-glow hover:shadow-lg transition-shadow"
              >
                {t('header.actions.signUp')}
              </Button>
            </>
          )}

          {/* Cart */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleCartClick}
            onMouseEnter={prefetchCart.onMouseEnter}
            onFocus={prefetchCart.onFocus}
            onMouseLeave={prefetchCart.onMouseLeave}
            onBlur={prefetchCart.onBlur}
            className="min-w-[44px] min-h-[44px] p-0 relative shadow-butterfly-glow hover:shadow-lg transition-shadow flex items-center justify-center"
            aria-label={
              itemCount > 0
                ? t('header.actions.cartWithItems', { count: itemCount })
                : t('header.actions.cart')
            }
          >
            <Icon name="shopping_bag" className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[20px] h-5 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
