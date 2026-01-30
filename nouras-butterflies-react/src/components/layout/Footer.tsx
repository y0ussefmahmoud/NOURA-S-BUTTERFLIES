import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon } from '../ui/Icon';
import { NewsletterSection } from '../home/NewsletterSection';

interface FooterProps {
  className?: string;
  onNewsletterSubmit?: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ className = '', onNewsletterSubmit }) => {
  const { t } = useTranslation('navigation');

  const socialLinks = [
    { name: 'Facebook', icon: 'facebook', href: '#' },
    { name: 'Instagram', icon: 'photo_camera', href: '#' },
    { name: 'Twitter', icon: 'alternate_email', href: '#' },
    { name: 'Pinterest', icon: 'push_pin', href: '#' },
  ];

  const shopLinks = [
    { label: t('footer.shop.allProducts'), href: '/shop' },
    { label: t('footer.shop.newArrivals'), href: '/new-arrivals' },
    { label: t('footer.shop.veganCollection'), href: '/vegan' },
    { label: t('footer.shop.bestSellers'), href: '/best-sellers' },
    { label: t('footer.shop.giftSets'), href: '/gift-sets' },
  ];

  const companyLinks = [
    { label: t('footer.company.ourStory'), href: '/about' },
    { label: t('footer.company.sustainability'), href: '/sustainability' },
    { label: t('footer.company.blog'), href: '/blog' },
    { label: t('footer.company.press'), href: '/press' },
    { label: t('footer.company.careers'), href: '/careers' },
  ];

  const supportLinks = [
    { label: t('footer.support.contactUs'), href: '/contact' },
    { label: t('footer.support.shippingInfo'), href: '/shipping' },
    { label: t('footer.support.returns'), href: '/returns' },
    { label: t('footer.support.sizeGuide'), href: '/size-guide' },
    { label: t('footer.support.faq'), href: '/faq' },
  ];

  return (
    <footer className={`bg-accent-pink dark:bg-background-dark py-20 ${className}`}>
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Newsletter Section */}
        <NewsletterSection onSubmit={onNewsletterSubmit} />

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="flutter_dash" className="w-6 h-6 text-primary" />
              <span className="font-display text-lg font-bold text-foreground-light dark:text-foreground-dark">
                {t('header.logo')}
              </span>
            </div>
            <p className="text-foreground-light/70 dark:text-foreground-dark/70 mb-6 text-sm leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                  aria-label={social.name}
                >
                  <Icon name={social.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark mb-4">
              {t('footer.shop.title')}
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground-light/70 dark:text-foreground-dark/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark mb-4">
              {t('footer.company.title')}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground-light/70 dark:text-foreground-dark/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground-light dark:text-foreground-dark mb-4">
              {t('footer.support.title')}
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground-light/70 dark:text-foreground-dark/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border-light dark:border-border-dark pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground-light/60 dark:text-foreground-dark/60">
              {t('footer.copyright')}
            </p>

            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-sm text-foreground-light/60 dark:text-foreground-dark/60 hover:text-primary transition-colors"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                to="/terms"
                className="text-sm text-foreground-light/60 dark:text-foreground-dark/60 hover:text-primary transition-colors"
              >
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
