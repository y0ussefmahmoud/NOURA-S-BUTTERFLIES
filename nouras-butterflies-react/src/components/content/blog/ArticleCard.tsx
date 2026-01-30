import React from 'react';
import { Card } from '../../ui';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  slug: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  category,
  image,
  slug,
}) => {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className="text-primary text-[10px] tracking-widest uppercase font-medium">
            {category}
          </span>
        </div>

        <h3 className="font-serif text-xl text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{excerpt}</p>

        <a
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
        >
          Read More
          <span className="material-symbols-rounded text-base">arrow_forward</span>
        </a>
      </div>
    </Card>
  );
};
