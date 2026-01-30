import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { validateEmail } from '../../utils/formSubmission';

export interface NewsletterPopupProps {
  open: boolean;
  onClose: () => void;
}

export const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Check if user is already subscribed
  const isSubscribed = localStorage.getItem('noura-newsletter-subscribed') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store subscription status
      localStorage.setItem('noura-newsletter-subscribed', 'true');

      setIsSuccess(true);

      // Close after success delay
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setIsSuccess(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('noura-newsletter-dismissed', 'true');
    onClose();
  };

  if (isSubscribed) {
    return null;
  }

  if (isSuccess) {
    return (
      <Modal open={open} onClose={onClose} size="md">
        <div className="text-center py-8">
          <div className="mb-4">
            <span className="material-symbols-outlined text-5xl text-green-500">check_circle</span>
          </div>
          <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
            Welcome to the Butterfly Family! 🦋
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Check your email for exclusive offers and beauty tips.
          </p>
          <Button onClick={onClose} variant="primary">
            Thanks!
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} size="md">
      <div className="text-center p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close popup"
        >
          <span className="material-symbols-outlined text-text-muted hover:text-text-dark">
            close
          </span>
        </button>

        {/* Decorative butterfly icon */}
        <div className="mb-6">
          <span className="material-symbols-outlined text-5xl text-[#C8A962] butterfly-glow">
            flutter_dash
          </span>
        </div>

        <h2 className="text-2xl font-bold text-text-dark dark:text-text-light mb-3">
          Stay in the Glow
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
          Get exclusive offers, new product alerts, and beauty tips delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#C8A962] bg-white dark:bg-surface-dark text-text-dark dark:text-text-light text-center ${
                emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              required
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-500 dark:text-red-400 text-center">
                {emailError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting || !email.trim() || !!emailError}
            className="bg-gradient-to-r from-[#C8A962] to-[#c8a95f] hover:from-[#c8a95f] hover:to-[#C8A962] text-white font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Subscribing...</span>
              </div>
            ) : (
              'Subscribe'
            )}
          </Button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleDismiss}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
          >
            No thanks, I don't want exclusive offers
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>No spam</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">close</span>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

NewsletterPopup.displayName = 'NewsletterPopup';
