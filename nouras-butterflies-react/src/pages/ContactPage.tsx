import React from 'react';
import { ContactInfo, ContactForm, ContactQuickLinks } from '../components/content/contact';
import { SEO } from '../components/SEO';
import { useSEO } from '../hooks/useSEO';

const ContactPage: React.FC = () => {
  // SEO metadata
  const seoData = useSEO('contact');

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      <main className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <ContactInfo />
              <ContactForm />
            </div>
          </div>

          <ContactQuickLinks />
        </div>
      </main>
    </>
  );
};

export default ContactPage;
