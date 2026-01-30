import React, { useEffect, useRef } from 'react';
import {
  HeroSection,
  TrustBar,
  BestSellersSection,
  BrandPhilosophySection,
  ButterflyDecor,
  ButterflySwarm,
} from '@/components/home';
import { useModals } from '@/contexts/ModalsContext';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useFirstVisit } from '@/hooks/useFirstVisit';
import { SEO } from '@/components/SEO';
import { useSEO } from '@/hooks/useSEO';

const HomePage: React.FC = () => {
  const { openNewsletterPopup, openFirstOrderPopup } = useModals();
  const { isScrolledPast } = useScrollPosition();
  const { isFirstVisit } = useFirstVisit();
  const hasTriggeredNewsletter = useRef(false);

  // SEO metadata
  const seoData = useSEO('home');

  // Newsletter popup scroll detection
  useEffect(() => {
    // Check if user is already subscribed or dismissed
    const isSubscribed = localStorage.getItem('noura-newsletter-subscribed') === 'true';
    const isDismissed = localStorage.getItem('noura-newsletter-dismissed') === 'true';

    // Show popup when user scrolls 50% of the page, guard to fire once per session
    if (isScrolledPast(50) && !isSubscribed && !isDismissed && !hasTriggeredNewsletter.current) {
      const timer = setTimeout(() => {
        openNewsletterPopup();
        hasTriggeredNewsletter.current = true;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isScrolledPast, openNewsletterPopup]);

  // First-order popup auto-trigger for first visits
  useEffect(() => {
    if (isFirstVisit) {
      // Check if user has already dismissed or subscribed to first-order popup
      const isFirstOrderDismissed = localStorage.getItem('noura-first-order-dismissed') === 'true';
      const isFirstOrderSubscribed =
        localStorage.getItem('noura-first-order-subscribed') === 'true';

      if (!isFirstOrderDismissed && !isFirstOrderSubscribed) {
        const timer = setTimeout(() => {
          openFirstOrderPopup();
        }, 3000); // Show after 3 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [isFirstVisit, openFirstOrderPopup]);

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      <div className="relative">
        {/* Butterfly decorations */}
        <ButterflySwarm count={4} className="fixed inset-0 pointer-events-none z-10" />

        {/* Main content */}
        <div className="relative z-20">
          <HeroSection />
          <TrustBar />
          <BestSellersSection />
          <BrandPhilosophySection />
        </div>
      </div>
    </>
  );
};

export default HomePage;
