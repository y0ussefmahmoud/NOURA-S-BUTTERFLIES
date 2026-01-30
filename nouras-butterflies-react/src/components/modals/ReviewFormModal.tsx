import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ButterflyRating } from '../ui/ButterflyRating';
import { ImageUpload } from '../ui/ImageUpload';
import { useFormValidation } from '../../hooks/useFormValidation';
import {
  sanitizeInput,
  sanitizeHTML,
  sanitizeFormData,
  validateFileUpload,
} from '../../utils/sanitization';
import { http } from '../../utils/httpInterceptor';
import { rateLimiters } from '../../utils/rateLimiter';

export interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
  productId?: string;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  open,
  onClose,
  productName = 'this product',
  productId,
}) => {
  const [rating, setRating] = useState(4);
  const [title, setTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [recommend, setRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { errors, validateForm, clearErrors } = useFormValidation({
    title: {
      required: true,
      minLength: 5,
      maxLength: 100,
    },
    experience: {
      required: true,
      minLength: 20,
      maxLength: 1000,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit before processing
    if (!rateLimiters.review.checkLimit('review-form')) {
      alert('Too many review submissions. Please try again later.');
      return;
    }

    if (!validateForm({ title, experience })) {
      return;
    }

    // Sanitize form data before submission
    const sanitizedData = sanitizeFormData({
      title,
      experience,
      rating,
      recommend,
      productId,
      productName,
    });

    // Additional sanitization for rich text content
    if (sanitizedData.experience) {
      sanitizedData.experience = sanitizeHTML(sanitizedData.experience);
    }

    // Validate uploaded files
    const validImages = images.filter((file) =>
      validateFileUpload(
        file,
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        5 * 1024 * 1024
      )
    );

    if (validImages.length !== images.length) {
      alert(
        'Some images were rejected due to invalid format or size. Please use JPEG, PNG, GIF, or WebP images under 5MB.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Send sanitized data to API
      const reviewData = {
        ...sanitizedData,
        images: validImages,
      };

      await http.post('/api/reviews', reviewData);

      // Record successful request for rate limiting
      rateLimiters.review.recordSuccess('review-form');

      setIsSuccess(true);

      // Close after success delay
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Review submission failed:', error);

      // Record failed request for rate limiting
      rateLimiters.review.recordFailure('review-form');

      alert('There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setTitle(sanitizedValue);
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setExperience(sanitizedValue);
  };

  const handleImageChange = (newImages: File[]) => {
    // Validate files before setting state
    const validImages = newImages.filter((file) =>
      validateFileUpload(
        file,
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        5 * 1024 * 1024
      )
    );

    if (validImages.length !== newImages.length) {
      console.warn('Some images were rejected due to invalid format or size');
    }

    setImages(validImages);
  };

  const resetForm = () => {
    setRating(4);
    setTitle('');
    setExperience('');
    setImages([]);
    setRecommend(true);
    setIsSuccess(false);
    clearErrors();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetForm();
    }
  };

  if (isSuccess) {
    return (
      <Modal open={open} onClose={handleClose} size="md">
        <div className="text-center py-8">
          <div className="mb-4">
            <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
            Thank You for Your Review! 🦋
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your feedback helps other customers make informed decisions.
          </p>
          <Button onClick={handleClose} variant="primary">
            Done
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={handleClose} size="lg">
      <Modal.Header>
        <div>
          <h2 className="text-2xl font-bold text-text-dark dark:text-text-light">
            Share Your Glow
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tell us about your experience with {productName}
          </p>
        </div>
      </Modal.Header>

      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Overall Rating
              </label>
              <div className="flex justify-center">
                <ButterflyRating value={rating} onChange={setRating} size="lg" variant="labeled" />
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Review Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Summarize your experience"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#C8A962] bg-white dark:bg-surface-dark text-text-dark dark:text-text-light"
                maxLength={100}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Review Experience */}
            <div>
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Experience *
              </label>
              <textarea
                id="experience"
                value={experience}
                onChange={handleExperienceChange}
                placeholder="Share details about your experience with this product..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#C8A962] bg-white dark:bg-surface-dark text-text-dark dark:text-text-light resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between mt-1">
                {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {experience.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Photos (Optional)
              </label>
              <ImageUpload onChange={handleImageChange} maxFiles={3} multiple preview />
            </div>

            {/* Recommend Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  Would you recommend this product?
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Help others make informed decisions
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={recommend}
                  onChange={(e) => setRecommend(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#C8A962]/20 dark:peer-focus:ring-[#C8A962]/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#C8A962]" />
              </label>
            </div>
          </div>

          {/* Decorative butterfly elements */}
          <div className="absolute top-4 right-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-[#C8A962]">flutter_dash</span>
          </div>
          <div className="absolute bottom-4 left-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-[#C8A962]">flutter_dash</span>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#C8A962] to-[#c8a95f] hover:from-[#c8a95f] hover:to-[#C8A962]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Review'
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

ReviewFormModal.displayName = 'ReviewFormModal';
