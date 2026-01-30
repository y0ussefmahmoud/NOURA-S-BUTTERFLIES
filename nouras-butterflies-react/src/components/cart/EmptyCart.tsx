import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils/cn';

interface EmptyCartProps {
  className?: string;
  message?: string;
  showContinueButton?: boolean;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({
  className,
  message = 'Your Shopping Bag is Empty',
  showContinueButton = true,
}) => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  return (
    <div
      className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}
    >
      {/* Decorative Butterfly Container */}
      <div className="relative mb-8">
        {/* Background large butterfly */}
        <Icon
          name="flutter_dash"
          size="xl"
          className="text-primary/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12"
        />

        {/* Main butterfly icon */}
        <Icon name="flutter_dash" size="lg" className="text-primary/40 relative z-10" />
      </div>

      {/* Empty Cart Message */}
      <h2 className="text-2xl font-bold text-text-dark dark:text-text-light mb-4">{message}</h2>

      <p className="text-lg text-text-muted mb-8 max-w-md mx-auto">
        Discover our beautiful collection of butterfly-inspired products and fill your bag with
        magic!
      </p>

      {/* Continue Shopping Button */}
      {showContinueButton && (
        <Button
          onClick={handleContinueShopping}
          size="lg"
          leftIcon="shopping_bag"
          className="shadow-butterfly-glow"
        >
          Continue Shopping
        </Button>
      )}

      {/* Additional Suggestions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center p-6 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
          <Icon name="eco" size="lg" className="text-primary mb-3" />
          <h3 className="font-semibold text-text-dark dark:text-text-light mb-2">Eco-Friendly</h3>
          <p className="text-sm text-text-muted">
            All our products are sustainably sourced and packaged
          </p>
        </div>

        <div className="text-center p-6 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
          <Icon name="cruelty_free" size="lg" className="text-primary mb-3" />
          <h3 className="font-semibold text-text-dark dark:text-text-light mb-2">Cruelty-Free</h3>
          <p className="text-sm text-text-muted">
            Never tested on animals, always kind to all creatures
          </p>
        </div>

        <div className="text-center p-6 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
          <Icon name="volunteer_activism" size="lg" className="text-primary mb-3" />
          <h3 className="font-semibold text-text-dark dark:text-text-light mb-2">
            Community Support
          </h3>
          <p className="text-sm text-text-muted">
            A portion of every purchase supports butterfly conservation
          </p>
        </div>
      </div>

      {/* Inspirational Quote */}
      <div className="mt-12 p-6 bg-accent-pink/10 dark:bg-accent-pink/5 rounded-xl border border-accent-pink/20 max-w-2xl mx-auto">
        <Icon name="format_quote" size="sm" className="text-primary mb-2" />
        <p className="text-text-dark dark:text-text-light italic">
          "Like a butterfly emerging from its cocoon, your beauty transformation begins with a
          single step."
        </p>
      </div>
    </div>
  );
};

EmptyCart.displayName = 'EmptyCart';
