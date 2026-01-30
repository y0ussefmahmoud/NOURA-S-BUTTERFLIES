import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useFirstVisit } from '../../hooks/useFirstVisit';
import { validateEmail } from '../../utils/formSubmission';

export interface FirstOrderPopupProps {
  open: boolean;
  onClose: () => void;
}

export const FirstOrderPopup: React.FC<FirstOrderPopupProps> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { markAsVisited } = useFirstVisit();

  useEffect(() => {
    if (open) {
      // Mark as visited when popup is shown
      markAsVisited();
    }
  }, [open, markAsVisited]);

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

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store in localStorage to prevent re-showing
      localStorage.setItem('noura-first-order-subscribed', 'true');

      setIsSuccess(true);

      // Close after success delay
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('noura-first-order-dismissed', 'true');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
      className="overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Left side - Image */}
        <div className="relative lg:w-1/2 bg-gradient-to-br from-[#C8A962]/20 to-[#c8a95f]/10">
          <div className="absolute inset-0 bg-black/20">
            <img
              src="https://picsum.photos/seed/noura-butterfly-club/600/800.jpg"
              alt="Join the Butterfly Club"
              className="w-full h-full object-cover opacity-60"
            />
          </div>

          {/* Overlay text */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 text-center text-white">
            <div className="mb-6">
              <span className="material-symbols-outlined text-6xl text-[#C8A962] butterfly-glow">
                flutter_dash
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Butterfly Club</h2>
            <p className="text-lg opacity-90 max-w-sm">
              Exclusive offers, early access, and beauty secrets await
            </p>
          </div>

          {/* Decorative butterfly elements */}
          <div className="absolute top-4 left-4 opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-4xl text-white">flutter_dash</span>
          </div>
          <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-4xl text-white">flutter_dash</span>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
            aria-label="Close popup"
          >
            <span className="material-symbols-outlined text-text-muted hover:text-text-dark">
              close
            </span>
          </button>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <span className="material-symbols-outlined text-5xl text-green-500">
                  check_circle
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                Welcome to the Club! 🦋
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check your email for your exclusive welcome offer.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-text-dark dark:text-text-light mb-4">
                  Join the Butterfly Club
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Get 15% off your first order and exclusive access to new products
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#C8A962]">check_circle</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      15% off your first order
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#C8A962]">check_circle</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Early access to new collections
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#C8A962]">check_circle</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Member-only rewards and gifts
                    </span>
                  </div>
                </div>
              </div>

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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#C8A962] bg-white dark:bg-surface-dark text-text-dark dark:text-text-light ${
                      emailError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    required
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-500 dark:text-red-400">{emailError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting || !email.trim() || !!emailError}
                  className="bg-gradient-to-r from-[#C8A962] to-[#c8a95f] hover:from-[#c8a95f] hover:to-[#C8A962] text-white font-semibold py-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Joining...</span>
                    </div>
                  ) : (
                    'Get 15% Off'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
                >
                  No thanks, I don't want exclusive offers
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating butterfly decorations outside modal */}
      <div className="absolute -top-8 -left-8 opacity-30 pointer-events-none">
        <span className="material-symbols-outlined text-6xl text-[#C8A962] animate-pulse">
          flutter_dash
        </span>
      </div>
      <div className="absolute -bottom-8 -right-8 opacity-30 pointer-events-none">
        <span className="material-symbols-outlined text-6xl text-[#C8A962] animate-pulse">
          flutter_dash
        </span>
      </div>
    </Modal>
  );
};

FirstOrderPopup.displayName = 'FirstOrderPopup';
