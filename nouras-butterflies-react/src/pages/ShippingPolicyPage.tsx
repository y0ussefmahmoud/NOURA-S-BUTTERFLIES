import React from 'react';
import { PolicyHero, PolicyGrid, PolicyDetailSection } from '../components/content/policy';

const ShippingPolicyPage: React.FC = () => {
  return (
    <main>
      <PolicyHero />
      <PolicyGrid />
      <PolicyDetailSection />
    </main>
  );
};

export default ShippingPolicyPage;
