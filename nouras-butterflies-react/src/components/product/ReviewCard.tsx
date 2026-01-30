import React from 'react';
import type { Review } from '../../types/productDetails';

interface ReviewCardProps {
  review: Review;
}

const ReviewCardComponent: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`material-symbols-rounded text-sm ${
          index < rating ? 'text-[#D4AF37]' : 'text-gray-300'
        }`}
      >
        {index < rating ? 'star' : 'star_outline'}
      </span>
    ));
  };

  return (
    <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-primary/5">
      <div className="flex items-center gap-1 mb-3">{renderStars(review.rating)}</div>

      <p className="text-sm italic leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
        "{review.text}"
      </p>

      <div className="flex items-center gap-3">
        <img
          src={review.avatar}
          alt={review.authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.authorName}</p>
          <div className="flex items-center gap-2">
            {review.verified && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                ✓ Verified Purchase
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = React.memo(ReviewCardComponent);

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;
