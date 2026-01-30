import React from 'react';
import type { HowToUse as HowToUseType } from '../../types/productDetails';

interface HowToUseProps {
  steps: HowToUseType['steps'];
  videoThumbnail: HowToUseType['videoThumbnail'];
}

const HowToUse: React.FC<HowToUseProps> = ({ steps, videoThumbnail }) => {
  return (
    <div className="bg-primary/10 p-10 rounded-xl border border-primary/20">
      <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-8">How to Use</h3>

      <div className="space-y-6 mb-8">
        {steps.map((step) => (
          <div key={step.stepNumber} className="flex items-start gap-4">
            <span className="material-symbols-rounded text-primary text-xl flex-shrink-0 mt-1">
              check_circle
            </span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative group cursor-pointer">
        <div className="aspect-video rounded-lg overflow-hidden">
          <img
            src={videoThumbnail.url}
            alt={videoThumbnail.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/50">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-rounded text-gray-900 text-3xl">play_arrow</span>
            </div>
          </div>
          {videoThumbnail.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {videoThumbnail.duration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
