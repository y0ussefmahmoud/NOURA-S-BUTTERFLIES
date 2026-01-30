import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

const NotFoundPage: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-primary/5 to-accent-gold/5">
      <div className="max-w-2xl w-full text-center">
        <div className="relative mb-12">
          <div className="aspect-[4/3] rounded-3xl shadow-2xl border-2 border-primary/20 overflow-hidden">
            <img
              src="/api/placeholder/800/600"
              alt="Lost butterfly illustration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="absolute top-8 left-8 text-primary/20">
            <span className="material-symbols-rounded text-6xl">flare</span>
          </div>
          <div className="absolute bottom-8 right-8 text-accent-gold/20">
            <span className="material-symbols-rounded text-6xl">filter_vintage</span>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl text-gray-900 dark:text-white mb-6">
          404 - Looks like this butterfly wandered off!
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-lg mx-auto">
          The page you're looking for seems to have fluttered away. Don't worry - even the most
          beautiful butterflies sometimes lose their way. Let us help you find your path back to
          beauty.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/">
            <Button variant="primary" className="inline-flex items-center gap-2">
              Fly Back Home
              <span className="material-symbols-rounded text-sm">home</span>
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="accent-gold" className="inline-flex items-center gap-2">
              Shop New Arrivals
              <span className="material-symbols-rounded text-sm">shopping_bag</span>
            </Button>
          </Link>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-primary/30 to-transparent" />
          <div className="text-primary">
            <span className="material-symbols-rounded text-4xl">flutter_dash</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
