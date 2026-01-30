export interface Offer {
  id: string;
  type: 'promo' | 'restock' | 'shipping' | 'reward';
  title: string;
  description: string;
  image: string;
  cta: string;
  ctaLink?: string;
  badge?: string;
  validUntil?: string;
  isActive: boolean;
}

export const mockOffers: Offer[] = [
  {
    id: '1',
    type: 'promo',
    title: 'Butterfly Glow Sale',
    description:
      'Get 25% off on all lip products. Limited time offer on our best-selling hydrating lip glow and cheek tints.',
    image: 'https://picsum.photos/seed/butterfly-glow-sale/400/300.jpg',
    cta: 'Shop Now',
    ctaLink: '/category/lip-gloss',
    badge: '25% OFF',
    validUntil: '2024-12-31',
    isActive: true,
  },
  {
    id: '2',
    type: 'restock',
    title: 'Silk Finish Powder - Back in Stock!',
    description:
      'Our luxurious setting powder is finally back. Get yours before it sells out again.',
    image: 'https://picsum.photos/seed/silk-finish-powder/400/300.jpg',
    cta: 'Shop Now',
    ctaLink: '/product/silk-finish-powder',
    badge: 'RESTOCKED',
    isActive: true,
  },
  {
    id: '3',
    type: 'shipping',
    title: 'Free Shipping on Orders $50+',
    description:
      'Enjoy complimentary shipping on all orders over $50. No code needed - automatically applied at checkout.',
    image: 'https://picsum.photos/seed/free-shipping/400/300.jpg',
    cta: 'Learn More',
    ctaLink: '/shipping',
    badge: 'FREE SHIPPING',
    isActive: true,
  },
  {
    id: '4',
    type: 'reward',
    title: 'Double Points Weekend',
    description:
      'Earn 2x Butterfly Rewards points on all purchases this weekend only. Stack up those points!',
    image: 'https://picsum.photos/seed/double-points/400/300.jpg',
    cta: 'Shop & Earn',
    ctaLink: '/rewards',
    badge: '2X POINTS',
    validUntil: '2024-11-30',
    isActive: true,
  },
  {
    id: '5',
    type: 'promo',
    title: 'New Customer Welcome',
    description: 'New here? Get 15% off your first order plus a free sample with any purchase.',
    image: 'https://picsum.photos/seed/welcome-offer/400/300.jpg',
    cta: 'Claim Offer',
    ctaLink: '/register',
    badge: 'WELCOME',
    isActive: true,
  },
  {
    id: '6',
    type: 'restock',
    title: 'Radiant Cheek Tint - New Shades!',
    description:
      'Introducing 3 new gorgeous shades of our bestselling cheek tint. Perfect for every skin tone.',
    image: 'https://picsum.photos/seed/new-shades/400/300.jpg',
    cta: 'Explore Shades',
    ctaLink: '/product/radiant-cheek-tint',
    badge: 'NEW',
    isActive: true,
  },
];
