import React from 'react';

export const GallerySection: React.FC = () => {
  const galleryImages = [
    { id: 1, span: 'col-span-2 row-span-2', src: '/api/placeholder/600/600' },
    { id: 2, span: 'col-span-1 row-span-1', src: '/api/placeholder/300/300' },
    { id: 3, span: 'col-span-1 row-span-1', src: '/api/placeholder/300/300' },
    { id: 4, span: 'col-span-1 row-span-2', src: '/api/placeholder/300/600' },
    { id: 5, span: 'col-span-2 row-span-1', src: '/api/placeholder/600/300' },
    { id: 6, span: 'col-span-1 row-span-1', src: '/api/placeholder/300/300' },
  ];

  return (
    <section className="py-24 px-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl text-gray-900 dark:text-white text-center mb-16">
          Our Story in Images
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className={`${image.span} relative overflow-hidden rounded-xl group cursor-pointer`}
            >
              <img
                src={image.src}
                alt={`Gallery image ${image.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
