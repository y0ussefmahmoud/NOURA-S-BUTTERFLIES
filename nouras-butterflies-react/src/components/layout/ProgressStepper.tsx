import React from 'react';
import { Icon } from '../ui/Icon';

interface Step {
  id: string;
  label: string;
  icon: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Progress" className={`flex justify-center mb-16 ${className}`}>
      <div className="flex items-center w-full max-w-2xl">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${
                      isActive
                        ? 'bg-primary text-white shadow-butterfly-glow'
                        : isCompleted
                          ? 'bg-primary text-white'
                          : 'border-2 border-border-light dark:border-border-dark text-foreground-light/50 dark:text-foreground-dark/50'
                    }
                  `}
                  aria-label={`Step ${index + 1}: ${step.label}`}
                >
                  {isCompleted ? (
                    <Icon name="check" className="w-5 h-5" />
                  ) : (
                    <Icon name={step.icon} className="w-5 h-5" />
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`
                    text-xs uppercase tracking-widest mt-2 transition-colors duration-300
                    ${
                      isActive
                        ? 'text-primary font-bold'
                        : isCompleted
                          ? 'text-foreground-light dark:text-foreground-dark'
                          : 'text-foreground-light/50 dark:text-foreground-dark/50'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-[2px] mx-4 transition-colors duration-300
                    ${isCompleted ? 'bg-primary' : 'bg-border-light dark:bg-border-dark'}
                  `}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
