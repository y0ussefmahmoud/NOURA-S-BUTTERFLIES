export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  slug: string;
  featured?: boolean;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Art of Natural Beauty: Transform Your Skincare Ritual',
    excerpt:
      'Discover how ancient botanical wisdom meets modern science to create the perfect harmony between nature and luxury in your daily beauty routine.',
    category: 'Skin Care',
    image: '/api/placeholder/800/1000',
    author: 'Noura Al-Mansoori',
    date: '2024-01-15',
    slug: 'art-of-natural-beauty',
    featured: true,
    content: 'Full article content goes here...',
  },
  {
    id: 2,
    title: 'The Power of Rosehip Oil in Skincare',
    excerpt:
      'Discover how this natural wonder can transform your skin with its rich vitamins and antioxidants.',
    category: 'Natural Ingredients',
    image: '/api/placeholder/800/1000',
    author: 'Dr. Sarah Johnson',
    date: '2024-01-12',
    slug: 'rosehip-oil-skincare',
  },
  {
    id: 3,
    title: 'Building Your Vegan Beauty Routine',
    excerpt:
      'Step-by-step guide to creating a comprehensive skincare routine using only vegan products.',
    category: 'Vegan Rituals',
    image: '/api/placeholder/800/1000',
    author: 'Emma Wilson',
    date: '2024-01-10',
    slug: 'vegan-beauty-routine',
  },
  {
    id: 4,
    title: 'Morning Rituals for Radiant Skin',
    excerpt:
      'Start your day with these simple yet effective skincare practices for glowing results.',
    category: 'Tutorials',
    image: '/api/placeholder/800/1000',
    author: 'Maya Patel',
    date: '2024-01-08',
    slug: 'morning-skincare-rituals',
  },
  {
    id: 5,
    title: 'Understanding Clean Beauty',
    excerpt: 'What clean beauty really means and how to identify truly natural skincare products.',
    category: 'Skin Care',
    image: '/api/placeholder/800/1000',
    author: 'Lisa Chen',
    date: '2024-01-05',
    slug: 'understanding-clean-beauty',
  },
  {
    id: 6,
    title: 'The Mind-Skin Connection',
    excerpt: 'How your mental wellbeing impacts your skin health and beauty from within.',
    category: 'Inner Beauty',
    image: '/api/placeholder/800/1000',
    author: 'Dr. Michael Roberts',
    date: '2024-01-03',
    slug: 'mind-skin-connection',
  },
  {
    id: 7,
    title: 'Sustainable Beauty Practices',
    excerpt:
      'Simple ways to make your beauty routine more eco-friendly without compromising results.',
    category: 'Natural Ingredients',
    image: '/api/placeholder/800/1000',
    author: 'Green Living Team',
    date: '2024-01-01',
    slug: 'sustainable-beauty-practices',
  },
  {
    id: 8,
    title: 'Winter Skincare Essentials',
    excerpt:
      'Protect and nourish your skin during the colder months with these essential tips and products.',
    category: 'Skin Care',
    image: '/api/placeholder/800/1000',
    author: 'Skincare Experts',
    date: '2023-12-28',
    slug: 'winter-skincare-essentials',
  },
];

export const blogCategories = [
  'All Stories',
  'Skin Care',
  'Natural Ingredients',
  'Tutorials',
  'Inner Beauty',
  'Vegan Rituals',
];

export const getFeaturedPost = (): BlogPost | undefined => {
  return blogPosts.find((post) => post.featured);
};

export const getPostsByCategory = (category: string): BlogPost[] => {
  if (category === 'All Stories') {
    return blogPosts;
  }
  return blogPosts.filter((post) => post.category === category);
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};
