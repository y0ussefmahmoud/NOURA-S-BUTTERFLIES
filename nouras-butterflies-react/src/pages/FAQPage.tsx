import React from 'react';
import { FAQHero, FAQAccordion, FAQContactCTA } from '../components/content/faq';
import { SEO } from '../components/SEO';
import { useSEO } from '../hooks/useSEO';

const FAQPage: React.FC = () => {
  // SEO metadata
  const seoData = useSEO('faq');

  const faqSections = [
    {
      title: 'Orders & Shipping',
      icon: 'local_shipping',
      items: [
        {
          question: 'How long does shipping take?',
          answer:
            'Shipping times vary by location:\n\nUAE: 1-2 business days\nKSA & Kuwait: 3-5 business days\nEgypt: 2-4 business days\nInternational: 7-14 business days',
        },
        {
          question: 'Do you offer international shipping?',
          answer:
            'Yes, we ship worldwide! International shipping typically takes 7-14 business days depending on your location and customs processing.',
        },
        {
          question: 'How can I track my order?',
          answer:
            "Once your order ships, you'll receive a tracking number via email. You can use this to track your package on our website or the carrier's website.",
        },
        {
          question: 'What if my package is lost or damaged?',
          answer:
            "If your package is lost or damaged during transit, please contact us immediately at support@nourasbutterflies.com with your order number and we'll arrange a replacement or refund.",
        },
      ],
    },
    {
      title: 'Product Information',
      icon: 'eco',
      items: [
        {
          question: 'Are your products really vegan?',
          answer:
            'Yes! All our products are 100% vegan and cruelty-free. We never use animal-derived ingredients and never test on animals.',
        },
        {
          question: 'What ingredients do you use?',
          answer:
            'We use only natural, plant-based ingredients sourced sustainably from around the world. Each product lists its full ingredients on the packaging and website.',
        },
        {
          question: 'Are your products suitable for sensitive skin?',
          answer:
            'Our products are formulated with gentle, natural ingredients that are generally suitable for sensitive skin. However, we always recommend patch testing new products first.',
        },
        {
          question: 'Do your products have expiration dates?',
          answer:
            'Yes, all our products have a Period After Opening (PAO) symbol indicating how long they remain effective after opening. Unopened products typically last 2-3 years.',
        },
      ],
    },
    {
      title: 'Returns & Refunds',
      icon: 'assignment_return',
      items: [
        {
          question: 'What is your return policy?',
          answer:
            'We offer a 30-day return policy from the date of delivery. Products must be unused and in original packaging for a full refund.',
        },
        {
          question: 'How do I initiate a return?',
          answer:
            "To initiate a return, email us at support@nourasbutterflies.com with your order number and reason for return. We'll provide you with return instructions.",
        },
        {
          question: 'Who pays for return shipping?',
          answer:
            "We provide free return shipping for defective items. For change of mind returns, return shipping costs are the customer's responsibility.",
        },
        {
          question: 'When will I receive my refund?',
          answer:
            'Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method.',
        },
      ],
    },
  ];

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      <main>
        <FAQHero />

        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <FAQAccordion sections={faqSections} />
          </div>
        </section>

      <FAQContactCTA />
    </main>
    </>
  );
};

export default FAQPage;
