import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Button,
  Card,
} from '../../ui';

interface FAQSection {
  title: string;
  icon: string;
  items: {
    question: string;
    answer: string;
  }[];
}

interface FAQAccordionProps {
  sections: FAQSection[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ sections }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-rounded text-3xl text-primary">{section.icon}</span>
            <h2 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white">
              {section.title}
            </h2>
          </div>

          <Accordion allowMultiple>
            {section.items.map((item, itemIndex) => (
              <AccordionItem key={itemIndex} value={`${sectionIndex}-${itemIndex}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {item.answer.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="flex items-start gap-2">
                        <span className="text-primary mt-1">🦋</span>
                        <span>{paragraph}</span>
                      </p>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}

      <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent-gold/10 border-primary/20">
        <div className="text-center">
          <h3 className="font-serif text-2xl text-gray-900 dark:text-white mb-4">
            30-Day Happiness Guarantee
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Not completely satisfied with your purchase? Return it within 30 days for a full refund.
            We're confident you'll love our products as much as we do.
          </p>
          <Button variant="primary">Start a Return</Button>
        </div>
      </Card>
    </div>
  );
};
