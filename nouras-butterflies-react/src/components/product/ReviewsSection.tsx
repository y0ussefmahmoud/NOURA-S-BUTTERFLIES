import React, { useState, useMemo } from 'react';
import ReviewCard from './ReviewCard';
import type { Review } from '../../types/productDetails';

interface ReviewsSectionProps {
  reviews: Review[];
  onWriteReview?: () => void;
  maxReviews?: number;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onWriteReview,
  maxReviews = 3,
}) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 5 | 4 | 3 | 2 | 1>('all');
  const [showMore, setShowMore] = useState(false);

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Apply rating filter
    if (filterBy !== 'all') {
      filtered = reviews.filter((review) => review.rating === filterBy);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return sorted;
  }, [reviews, sortBy, filterBy]);

  const displayReviews = showMore
    ? filteredAndSortedReviews
    : filteredAndSortedReviews.slice(0, maxReviews);
  const hasMoreReviews = filteredAndSortedReviews.length > maxReviews;

  return (
    <div className="mb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif text-gray-900 dark:text-white">Customer Stories</h2>
        <button
          onClick={onWriteReview}
          className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors duration-200"
        >
          Write a Review
        </button>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredAndSortedReviews.length} review{filteredAndSortedReviews.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayReviews.map((review) => (
          <div key={review.id} className="lg:col-span-1">
            <ReviewCard review={review} />
          </div>
        ))}

        {hasMoreReviews && (
          <div className="lg:col-span-1">
            <div className="aspect-[4/5] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop&crop=face"
                alt="Community"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <p className="text-lg font-semibold mb-2">Join Our Community</p>
                  <p className="text-sm opacity-90">Shop the look</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View More/Less Button */}
      {hasMoreReviews && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowMore(!showMore)}
            className="bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors duration-200"
          >
            {showMore
              ? `Show Less (${maxReviews})`
              : `View All (${filteredAndSortedReviews.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
