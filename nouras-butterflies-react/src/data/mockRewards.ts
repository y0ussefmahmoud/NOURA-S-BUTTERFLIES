export interface UserProgress {
  currentPoints: number;
  currentTier: string;
  nextTier: string;
  progressPercentage: number;
}

export interface EarnActivity {
  icon: string;
  title: string;
  description: string;
  points: string;
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  points: string;
  locked: boolean;
  image: string;
}

export const userProgress: UserProgress = {
  currentPoints: 750,
  currentTier: 'Satin Wings',
  nextTier: 'Velvet Wings',
  progressPercentage: 75,
};

export const earnActivities: EarnActivity[] = [
  {
    icon: 'shopping_bag',
    title: 'Make a Purchase',
    description: 'Earn 1 point for every AED 1 spent',
    points: '1 pt per AED',
  },
  {
    icon: 'cake',
    title: 'Birthday Bonus',
    description: 'Receive 50 bonus points on your birthday',
    points: '50 pts',
  },
  {
    icon: 'rate_review',
    title: 'Write a Review',
    description: 'Share your experience and earn points',
    points: '25 pts',
  },
  {
    icon: 'share',
    title: 'Refer a Friend',
    description: 'Get 100 points when your friend makes their first purchase',
    points: '100 pts',
  },
];

export const availableRewards: Reward[] = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'Complimentary shipping on your next order',
    points: '100',
    locked: false,
    image: '/api/placeholder/300/200',
  },
  {
    id: 2,
    title: '15% Off Coupon',
    description: 'Get 15% off your entire purchase',
    points: '200',
    locked: false,
    image: '/api/placeholder/300/200',
  },
  {
    id: 3,
    title: 'Free Mini Facial',
    description: 'Complimentary 30-minute facial at our Dubai showroom',
    points: '500',
    locked: false,
    image: '/api/placeholder/300/200',
  },
  {
    id: 4,
    title: 'Exclusive Product Access',
    description: 'Early access to new product launches',
    points: '1000',
    locked: true,
    image: '/api/placeholder/300/200',
  },
  {
    id: 5,
    title: 'VIP Event Invitation',
    description: 'Exclusive invitation to our annual beauty event',
    points: '1500',
    locked: true,
    image: '/api/placeholder/300/200',
  },
  {
    id: 6,
    title: 'Personal Consultation',
    description: 'One-on-one skincare consultation with our experts',
    points: '2000',
    locked: true,
    image: '/api/placeholder/300/200',
  },
];
