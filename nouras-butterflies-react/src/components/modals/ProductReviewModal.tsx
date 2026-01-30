import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ButterflyRating } from '../ui/ButterflyRating';
import { ImageUpload } from '../ui/ImageUpload';
import { useFormValidation } from '../../hooks/useFormValidation';
import type { Product } from '../../types/product';

export interface ProductReviewModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
}

export const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  open,
  onClose,
  product,
}) => {
  const [rating, setRating] = useState(4);
  const [thoughts, setThoughts] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { errors, validateForm, clearErrors } = useFormValidation({
    thoughts: {
      required: true,
      minLength: 20,
      maxLength: 1000,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm({ thoughts })) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);

      // Close after success delay
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Review submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(4);
    setThoughts('');
    setImages([]);
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
            Review Submitted! 🦋
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for sharing your experience with {product?.name || 'this product'}.
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
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left side - Product Image */}
        <div className="lg:w-1/2 relative">
          <div className="aspect-square lg:aspect-auto lg:h-full bg-gradient-to-br from-[#C8A962]/10 to-[#c8a95f]/5">
            {product?.images[0] && (
              <>
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm opacity-90">{product.category}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right side - Form */}
        <div className="lg:w-1/2 p-6 lg:p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>Home</span>
            <span>/</span>
            <span>{product?.category}</span>
            <span>/</span>
            <span>{product?.name}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Your Rating
                </label>
                <ButterflyRating value={rating} onChange={setRating} size="lg" variant="default" />
              </div>

              {/* Thoughts */}
              <div>
                <label
                  htmlFor="thoughts"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Thoughts *
                </label>
                <textarea
                  id="thoughts"
                  value={thoughts}
                  onChange={(e) => setThoughts(e.target.value)}
                  placeholder="Tell us what you loved about this product..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#C8A962] bg-white dark:bg-surface-dark text-text-dark dark:text-text-light resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between mt-1">
                  {errors.thoughts && <p className="text-sm text-red-500">{errors.thoughts}</p>}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {thoughts.length}/1000 characters
                  </p>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Photos (Optional)
                </label>
                <ImageUpload onChange={setImages} maxFiles={3} multiple preview />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#C8A962] to-[#c8a95f] hover:from-[#c8a95f] hover:to-[#C8A962] text-white font-semibold py-3 transition-all duration-300 hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

ProductReviewModal.displayName = 'ProductReviewModal';
