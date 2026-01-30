import React from 'react';
import {
  AboutHero,
  MissionSection,
  FounderSection,
  ValuesGrid,
  GallerySection,
} from '../components/content/about';
import { NewsletterCTA } from '../components/content/blog';
import { SEO } from '../components/SEO';
import { useSEO } from '../hooks/useSEO';

const AboutPage: React.FC = () => {
  // SEO metadata
  const seoData = useSEO('about');

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      <main>
        <AboutHero />
        <MissionSection />
        <FounderSection />
        <ValuesGrid />
        <GallerySection />
        <NewsletterCTA />
      </main>
    </>
  );
};

export default AboutPage;
