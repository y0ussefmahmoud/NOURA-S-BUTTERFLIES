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

export interface FeedbackFormModalProps {
  open: boolean;
  onClose: () => void;
}

const ratingLabels = ['Basic', 'Nice', 'Glowing', 'Luminous', 'Radiant'];

export const FeedbackFormModal: React.FC<FeedbackFormModalProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [rating, setRating] = useState(3);
  const [glowStory, setGlowStory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [shareOnSocial, setShareOnSocial] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { errors, validateForm, clearErrors } = useFormValidation({
    glowStory: {
      required: true,
      minLength: 20,
      maxLength: 1000,
    },
  });

  const totalSteps = 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submission
    // Check rate limit before processing
    if (!rateLimiters.form.checkLimit('feedback-form')) {
      alert('Too many feedback submissions. Please try again later.');
      return;
    }

    if (!validateForm({ glowStory })) {
      return;
    }

    // Sanitize form data before submission
    const sanitizedData = sanitizeFormData({
      rating,
      glowStory,
      shareOnSocial,
    });

    // Additional sanitization for rich text content
    if (sanitizedData.glowStory) {
      sanitizedData.glowStory = sanitizeHTML(sanitizedData.glowStory);
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
      const feedbackData = {
        ...sanitizedData,
        images: validImages,
      };

      await http.post('/api/feedback', feedbackData);

      // Record successful request for rate limiting
      rateLimiters.form.recordSuccess('feedback-form');

      setIsSuccess(true);

      // Close after success delay
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Feedback submission failed:', error);

      // Record failed request for rate limiting
      rateLimiters.form.recordFailure('feedback-form');

      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGlowStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setGlowStory(sanitizedValue);
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
    setCurrentStep(1);
    setRating(3);
    setGlowStory('');
    setImages([]);
    setShareOnSocial(false);
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
            Thank You for Your Feedback! 🦋
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your glow story helps us create better products for our community.
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
      {/* Progress Tabs */}
      <div className="border-b border-border-light dark:border-border-dark">
        <div className="flex">
          {['RATE', 'COMMENT', 'SHARE'].map((step, index) => (
            <button
              key={step}
              onClick={() => setCurrentStep(index + 1)}
              className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
                currentStep > index + 1
                  ? 'text-[#C8A962]'
                  : currentStep === index + 1
                    ? 'text-text-dark dark:text-text-light'
                    : 'text-gray-400 dark:text-gray-500'
              }`}
              disabled={isSubmitting}
            >
              {step}
              {currentStep > index + 1 && (
                <span className="material-symbols-outlined absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                  check
                </span>
              )}
              {currentStep === index + 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A962]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Modal.Body className="relative">
          {/* Blurred background image */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <img
              src="https://picsum.photos/seed/botanical-ingredients/800/600.jpg"
              alt="Botanical ingredients"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            {currentStep === 1 && (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                  Rate Your Experience
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  How would you describe your glow?
                </p>

                <div className="flex justify-center">
                  <ButterflyRating
                    value={rating}
                    onChange={setRating}
                    size="lg"
                    variant="labeled"
                    labels={ratingLabels}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="py-8">
                <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                  Share Your Glow Story
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Tell us about your experience and how our products made you feel.
                </p>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="glowStory"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Your Glow Story *
                    </label>
                    <textarea
                      id="glowStory"
                      value={glowStory}
                      onChange={handleGlowStoryChange}
                      placeholder="Describe your experience, the results you saw, and how it made you feel..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-[#C8A962] bg-white dark:bg-surface-dark text-text-dark dark:text-text-light resize-none"
                      maxLength={1000}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.glowStory && (
                        <p className="text-sm text-red-500">{errors.glowStory}</p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {glowStory.length}/1000 characters
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Add Photos (Optional)
                    </label>
                    <ImageUpload onChange={handleImageChange} maxFiles={3} multiple preview />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                  Share Your Glow
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Inspire others by sharing your experience on social media
                </p>

                <div className="space-y-6">
                  <div className="flex justify-center space-x-4">
                    {['instagram', 'facebook', 'twitter'].map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-[#C8A962] hover:text-white rounded-full transition-colors"
                        aria-label={`Share on ${platform}`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {platform === 'instagram' && 'photo_camera'}
                          {platform === 'facebook' && 'thumb_up'}
                          {platform === 'twitter' && 'chat'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <input
                      type="checkbox"
                      id="shareOnSocial"
                      checked={shareOnSocial}
                      onChange={(e) => setShareOnSocial(e.target.checked)}
                      className="w-4 h-4 text-[#C8A962] border-gray-300 rounded focus:ring-[#C8A962]"
                    />
                    <label
                      htmlFor="shareOnSocial"
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      I shared my glow story
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-between items-center w-full">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? handleClose : handlePrevious}
              disabled={isSubmitting}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </div>

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
              ) : currentStep === totalSteps ? (
                'Submit Feedback'
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

FeedbackFormModal.displayName = 'FeedbackFormModal';
