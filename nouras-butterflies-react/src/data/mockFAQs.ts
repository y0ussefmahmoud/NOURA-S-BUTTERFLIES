export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  icon: string;
  items: FAQItem[];
}

export const faqSections: FAQSection[] = [
  {
    title: 'Orders & Shipping',
    icon: 'local_shipping',
    items: [
      {
        id: 'shipping-time',
        question: 'How long does shipping take?',
        answer:
          'Shipping times vary by location:\n\nUAE: 1-2 business days\nKSA & Kuwait: 3-5 business days\nEgypt: 2-4 business days\nInternational: 7-14 business days',
      },
      {
        id: 'international-shipping',
        question: 'Do you offer international shipping?',
        answer:
          'Yes, we ship worldwide! International shipping typically takes 7-14 business days depending on your location and customs processing.',
      },
    ],
  },
  {
    title: 'Product Information',
    icon: 'eco',
    items: [
      {
        id: 'vegan-products',
        question: 'Are your products really vegan?',
        answer:
          'Yes! All our products are 100% vegan and cruelty-free. We never use animal-derived ingredients and never test on animals.',
      },
    ],
  },
];
