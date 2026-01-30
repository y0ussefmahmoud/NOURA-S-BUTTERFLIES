import React from 'react';
import type { CheckoutStep } from '../../types/checkout';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils/cn';

interface CheckoutTimelineProps {
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];
  className?: string;
}

interface TimelineStep {
  id: CheckoutStep;
  label: string;
  icon: string;
}

export const CheckoutTimeline: React.FC<CheckoutTimelineProps> = ({
  currentStep,
  completedSteps,
  className,
}) => {
  const timelineSteps: TimelineStep[] = [
    { id: 'shipping', label: 'Shipping', icon: 'local_shipping' },
    { id: 'payment', label: 'Payment', icon: 'payments' },
    { id: 'review', label: 'Review', icon: 'fact_check' },
  ];

  const getStepStatus = (stepId: CheckoutStep) => {
    if (currentStep === stepId) return 'active';
    if (completedSteps.includes(stepId)) return 'completed';
    return 'pending';
  };

  return (
    <div className={cn('flex items-center justify-center mb-8', className)}>
      <div className="flex items-center space-x-4 md:space-x-8">
        {timelineSteps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === timelineSteps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center">
                {/* Step Icon */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300',
                    status === 'completed' && 'bg-green-500 text-white',
                    status === 'active' &&
                      'bg-primary text-white shadow-butterfly-glow animate-pulse',
                    status === 'pending' &&
                      'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                  )}
                >
                  {status === 'completed' ? (
                    <Icon name="check" size="md" />
                  ) : (
                    <Icon name={step.icon} size="md" />
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={cn(
                    'text-sm font-medium mt-2 transition-colors duration-300',
                    status === 'completed' && 'text-green-600 dark:text-green-400',
                    status === 'active' && 'text-primary font-bold',
                    status === 'pending' && 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {step.label}
                </span>

                {/* Step Status */}
                {status === 'completed' && (
                  <span className="text-xs text-green-600 dark:text-green-400 mt-1">Verified</span>
                )}
                {status === 'active' && (
                  <span className="text-xs text-primary mt-1">Processing</span>
                )}
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    'w-8 md:w-16 h-0.5 transition-colors duration-300',
                    status === 'completed' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

CheckoutTimeline.displayName = 'CheckoutTimeline';
