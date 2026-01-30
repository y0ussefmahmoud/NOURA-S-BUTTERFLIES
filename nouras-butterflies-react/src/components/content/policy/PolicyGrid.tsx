import React from 'react';
import { Card } from '../../ui';

export const PolicyGrid: React.FC = () => {
  const policies = [
    {
      icon: 'local_shipping',
      title: 'Shipping Timeline',
      content: [
        'UAE: 1-2 business days',
        'KSA & Kuwait: 3-5 business days',
        'Egypt: 2-4 business days',
        'International: 7-14 business days',
      ],
    },
    {
      icon: 'public',
      title: 'Delivery Areas',
      content: null,
      areas: ['Egypt', 'UAE', 'KSA', 'Kuwait'],
    },
    {
      icon: 'assignment_return',
      title: 'Return Conditions',
      content: [
        '30-day return policy from delivery date',
        'Products must be unused and in original packaging',
        'Free returns for defective items',
        'Return shipping fee applies for change of mind',
      ],
    },
    {
      icon: 'currency_exchange',
      title: 'Refund Process',
      content: [
        'Refunds processed within 5-7 business days',
        'Refund to original payment method',
        'Store credit option available immediately',
        'Confirmation email sent upon processing',
      ],
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {policies.map((policy, index) => (
            <Card key={index} className="p-8 bg-white dark:bg-white/5 luxury-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-rounded text-2xl text-primary">
                    {policy.icon}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-gray-900 dark:text-white">
                  {policy.title}
                </h3>
              </div>

              {policy.content && (
                <ul className="space-y-3">
                  {policy.content.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-3 text-gray-600 dark:text-gray-300 butterfly-bullet"
                    >
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {policy.areas && (
                <div className="flex flex-wrap gap-3">
                  {policy.areas.map((area, areaIndex) => (
                    <span
                      key={areaIndex}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
