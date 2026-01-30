import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface NewsletterSectionProps {
  onSubmit?: (email: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onSubmit }) => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Call onSubmit prop if provided
    onSubmit?.(email);

    // Simulate submission
    setIsSubmitted(true);
    setEmail('');

    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="mb-16">
      <div
        ref={ref}
        className={`max-w-lg mx-auto text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
      >
        {/* Heading */}
        <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">Stay in the Glow</h2>

        {/* Description */}
        <p className="mb-8 text-gray-600">
          Subscribe to our newsletter for exclusive offers, beauty tips, and new product launches.
        </p>

        {/* Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto whitespace-nowrap"
              >
                Subscribe
              </Button>
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        ) : (
          /* Success Message */
          <div className="rounded-lg bg-green-50 p-6">
            <div className="flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-800 font-medium">
                Thank you for subscribing! Check your email for confirmation.
              </p>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <p className="mt-4 text-xs text-gray-500">
          By subscribing, you agree to our Privacy Policy and Terms of Service. You can unsubscribe
          at any time.
        </p>
      </div>
    </section>
  );
};
