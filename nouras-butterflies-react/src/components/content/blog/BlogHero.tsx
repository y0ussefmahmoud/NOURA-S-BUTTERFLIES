import React from 'react';
import { Badge, Button } from '../../ui';

export const BlogHero: React.FC = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/api/placeholder/1920/800"
          alt="Featured article background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 px-6 py-16 max-w-4xl mx-auto text-white">
        <div className="mb-6">
          <Badge
            variant="primary"
            className="bg-white/20 backdrop-blur-sm text-white border-white/30"
          >
            Featured Story
          </Badge>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
          The Art of Natural Beauty: Transform Your Skincare Ritual
        </h1>

        <p className="text-lg md:text-xl mb-8 text-white/90 line-clamp-2 max-w-2xl">
          Discover how ancient botanical wisdom meets modern science to create the perfect harmony
          between nature and luxury in your daily beauty routine.
        </p>

        <Button
          variant="primary"
          className="bg-white text-gray-900 hover:bg-gray-100 inline-flex items-center gap-2"
        >
          Read Article
          <span className="material-symbols-rounded text-sm">arrow_forward</span>
        </Button>
      </div>

      <div className="absolute top-8 right-8 text-white/20">
        <span className="material-symbols-rounded text-8xl">flutter_dash</span>
      </div>
    </section>
  );
};
