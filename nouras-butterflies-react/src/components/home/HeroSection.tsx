import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation('home');
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 py-20 lg:py-32">
      {/* Decorative blur circles */}
      <div className="absolute left-10 top-20 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute right-10 top-40 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 opacity-20 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center ${
            isVisible ? 'animate-fadeInUp' : 'opacity-0'
          }`}
        >
          {/* Content Column */}
          <div className="text-center lg:text-start">
            {/* Gold accent label */}
            <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 text-sm font-medium text-white">
              <Icon name="star" className="mr-2 h-4 w-4" />
              {t('hero.badge')}
            </div>

            {/* Headline with mixed typography */}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t('hero.headline')}
              <br />
              <span className="italic text-primary-600">{t('hero.headlineAccent')}</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-lg text-gray-600 lg:text-xl">{t('hero.subtitle')}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row lg:justify-start">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                {t('hero.cta.shop')}
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t('hero.cta.learn')}
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-200">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHF_dm3j28Sn4LAxWVyJTOu95tMUdmGrSaMwwHNATc2eQGJKqYps-qe9BkVS92rLZL3Xc1T6_XlvF24JUOuKmPei8-Pfn6tdHwfVQ-BTyv2Hb5TCqeQAFD-SD6UAzHfFCNN7FxZrC6CTCzlmCXYlK8X2oSjStqfk_8puHnI70hI8J44-XwEKEUSHweXxdylflwpsAiveIsfZx4yxEjKxmpvtphWqQ4y_0c9euAXLi4-Ox6l1b33FBNvuj96OIsKsYMUXbDJjQ9unQ"
                alt={t('hero.imageAlt')}
                className="h-full w-full object-cover"
              />

              {/* Floating badge overlay */}
              <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <Icon name="eco" className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    {t('hero.veganBadge')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
