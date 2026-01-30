import React from 'react';

interface OrderTrackingProgressProps {
  currentStep: number;
  steps: Array<{
    id: number;
    label: string;
    icon: string;
    completed: boolean;
  }>;
  estimatedDelivery: string;
}

export const OrderTrackingProgress: React.FC<OrderTrackingProgressProps> = ({
  currentStep,
  steps,
  estimatedDelivery,
}) => {
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif text-gray-900">Order Progress</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Estimated Delivery</p>
          <p className="font-medium text-gray-900">{formatDate(estimatedDelivery)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-1 bg-pink-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.completed;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-pink-500 text-white ring-4 ring-pink-100 animate-pulse'
                          : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <span className="material-symbols-rounded text-lg">check</span>
                  ) : isActive ? (
                    <span className="material-symbols-rounded text-lg">flutter_dash</span>
                  ) : (
                    <span className="material-symbols-rounded text-lg">{step.icon}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p
                    className={`
                      text-sm font-medium mb-1
                      ${
                        isCompleted
                          ? 'text-green-600'
                          : isActive
                            ? 'text-pink-600'
                            : 'text-gray-500'
                      }
                    `}
                  >
                    {step.label}
                  </p>

                  {/* Status Indicator */}
                  {isActive && (
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                        <span className="material-symbols-rounded text-xs mr-1 animate-pulse">
                          pulse_dot
                        </span>
                        In Progress
                      </span>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <span className="material-symbols-rounded text-xs mr-1">check_circle</span>
                        Completed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Details */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="material-symbols-rounded text-pink-600 text-xl mr-3 mt-0.5">info</span>
          <div>
            <h4 className="font-medium text-pink-900 mb-1">
              {steps[currentStep]?.label || 'Processing'}
            </h4>
            <p className="text-sm text-pink-800">
              {currentStep === 0 && "We've received your order and are preparing it for shipment."}
              {currentStep === 1 && 'Your order is being carefully prepared and packaged.'}
              {currentStep === 2 && 'Your order has been shipped and is on its way to you.'}
              {currentStep === 3 && 'Your order is out for delivery and will arrive today.'}
              {currentStep === 4 && 'Your order has been successfully delivered. Enjoy!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
