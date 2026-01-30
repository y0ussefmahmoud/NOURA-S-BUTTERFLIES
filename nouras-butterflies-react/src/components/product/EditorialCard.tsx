import React from 'react';

interface EditorialCardProps {
  title: string;
  quote?: string;
  ctaText: string;
  ctaHref: string;
  icon?: string;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({
  title,
  quote,
  ctaText,
  ctaHref,
  icon = 'flutter_dash',
}) => {
  return (
    <div className="relative bg-primary/20 border border-primary/30 p-8 rounded-2xl overflow-hidden group">
      {/* Background Butterfly Icon */}
      <div className="absolute bottom-4 right-4 opacity-10 transform rotate-12 transition-all duration-500 group-hover:rotate-45 group-hover:scale-110">
        <span className="material-symbols-rounded text-8xl">{icon}</span>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <h3 className="font-display text-3xl font-black text-gray-900 mb-4 leading-tight">
          {title}
        </h3>

        {/* Quote */}
        {quote && <p className="text-lg italic text-gray-700 mb-6 leading-relaxed">{quote}</p>}

        {/* CTA Link */}
        <a
          href={ctaHref}
          className="inline-flex items-center text-primary font-semibold text-lg group/link"
        >
          {ctaText}
          <span className="material-symbols-rounded ml-2 transition-transform duration-300 group-hover/link:translate-x-1">
            arrow_forward
          </span>
        </a>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};
