import React, { useState } from 'react';
import { BlogHero, CategoryPills, ArticleCard, NewsletterCTA } from '../components/content/blog';

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All Stories');

  const categories = [
    'All Stories',
    'Skin Care',
    'Natural Ingredients',
    'Tutorials',
    'Inner Beauty',
    'Vegan Rituals',
  ];

  const articles = [
    {
      id: 1,
      title: 'The Power of Rosehip Oil in Skincare',
      excerpt:
        'Discover how this natural wonder can transform your skin with its rich vitamins and antioxidants.',
      category: 'Natural Ingredients',
      image: '/api/placeholder/400/500',
      slug: 'rosehip-oil-skincare',
    },
    {
      id: 2,
      title: 'Building Your Vegan Beauty Routine',
      excerpt:
        'Step-by-step guide to creating a comprehensive skincare routine using only vegan products.',
      category: 'Vegan Rituals',
      image: '/api/placeholder/400/500',
      slug: 'vegan-beauty-routine',
    },
    {
      id: 3,
      title: 'Morning Rituals for Radiant Skin',
      excerpt:
        'Start your day with these simple yet effective skincare practices for glowing results.',
      category: 'Tutorials',
      image: '/api/placeholder/400/500',
      slug: 'morning-skincare-rituals',
    },
    {
      id: 4,
      title: 'Understanding Clean Beauty',
      excerpt:
        'What clean beauty really means and how to identify truly natural skincare products.',
      category: 'Skin Care',
      image: '/api/placeholder/400/500',
      slug: 'understanding-clean-beauty',
    },
    {
      id: 5,
      title: 'The Mind-Skin Connection',
      excerpt: 'How your mental wellbeing impacts your skin health and beauty from within.',
      category: 'Inner Beauty',
      image: '/api/placeholder/400/500',
      slug: 'mind-skin-connection',
    },
    {
      id: 6,
      title: 'Sustainable Beauty Practices',
      excerpt:
        'Simple ways to make your beauty routine more eco-friendly without compromising results.',
      category: 'Natural Ingredients',
      image: '/api/placeholder/400/500',
      slug: 'sustainable-beauty-practices',
    },
  ];

  const filteredArticles =
    activeCategory === 'All Stories'
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  return (
    <main>
      <BlogHero />

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-white mb-4">
              Latest from the Garden
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Discover tips, stories, and insights from our world of natural beauty
            </p>
          </div>

          <CategoryPills
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </main>
  );
};

export default BlogPage;
