import React from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: 'wash',
    title: 'Gentle Formulas',
    description:
      'Our products are carefully crafted with sensitive skin in mind, using only the finest natural ingredients.',
  },
  {
    icon: 'psychology_alt',
    title: 'Mindful Beauty',
    description:
      'We believe beauty should be a conscious choice that enhances your natural radiance without compromise.',
  },
  {
    icon: 'sanitizer',
    title: 'Pure & Safe',
    description:
      'Every product is rigorously tested to ensure it meets our high standards for purity and safety.',
  },
];

export const BrandPhilosophySection: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient and blur decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50" />

      {/* Decorative blur circles */}
      <div className="absolute left-10 top-20 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute right-10 bottom-20 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-yellow-300 opacity-20 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          ref={ref}
          className={`rounded-3xl bg-white/80 backdrop-blur-sm p-8 lg:p-16 shadow-xl ${
            isVisible ? 'animate-fadeInUp' : 'opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhu7gF0FYxQVHwr19iB6fzVMKxbPEDw-bwuWY3m-ndVL2TJ8ijnD2r--ep7pJsneSdZWVFNnbtQX5FsNpkcySYqXjtUUxLJF3AT9AhUCCVFEkpY359NFxjZr7w9qVKGVLM_2DExfBZF7Nupiye5QtBPIsSqC655dWXHhrKfc2HuVSZocIZSYHcs2uvYwH96A8LZqgmAxs1Q0R-7oRz2da_Ac-6ryzdR2kCrlJrkku0I_xUShFbL4rV4xztjepm6aLQ1JXfA4DVYCQ"
                    alt="Natural ingredients"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCev4UiBqYbO5CnvyA-I8trY3gN7sz5lyv30BDY2C-QG0lLVG2eJCs1NKUMzAkC38aQ8hLRm95DXt6gjsBUq_zALmvirlFJKXsMWmutwe-klSx5sclh5VTXQEqDqA6e3Emu-TVrGHazkdUsga78CT5Sxw6WTqyrsVbeEq0lvEOyQzz3EbQKrIjiHFAVIbeO7DoeowxvVzJKhP6DCcmg_AbTn3naKUe0_yml7ae-VTRbG_3-Nas7cQZpU4qTWv2HqBhA0DHApgh1Ys4"
                    alt="Beauty products"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 lg:mt-8">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu77ivmWa8bXoQWJUDxTCOuClMWqJdJ6fcIKW6a-y030joQ7KKZ0joyYEk2BPd42kaqCNewt235spXTMX7fCJcUSnQsthSu2yArmVjbZu7Wp9t8VQ5c1HlwKZxrArQ0JLKKA50A5HA6DCJ8ultLyCuZHfUp2c8zzICasYJ4r_YZ6S54LVBT3-RQfneK8YvatFqxzsfntBLynsmfbp0fb-O22gJFN-ZUSjXSgZago2ndhZd6kgTfbu174aIflwyUl4y6yeYp0_k_vs"
                    alt="Skincare routine"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR-lMYeWEb9JEjhmMnF9tfkM55_aS4Y7sZpuLJMoYQZLZYKx3MhQ-ODKbDSfILrOGUworlTumNFCet6lwXLuPLAxaXPKqH4SVKUqsXEx7KodzHc7mdvpmZCP8O5Psrr0mka6wQftTvAqy3USz_mmZVpHfzB9aCeu7aPCqWcLliJsPwIXz-5sra4S17i7XDj_CiGlKw0WjuIxy0qRAlH-EdGYCJY0lswt0pMZv7dlCStATb2rwhBd5zPh0m3jfBHWtl1SD9bXWDb6g"
                    alt="Natural beauty"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center lg:text-left">
              {/* Gold label */}
              <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 text-sm font-medium text-white">
                Our Philosophy
              </div>

              {/* Heading */}
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                Beauty That
                <br />
                <span className="italic text-primary-600">Transcends</span>
              </h2>

              {/* Description */}
              <p className="mb-8 text-lg text-gray-600 lg:text-xl">
                At Noura's Butterflies, we believe that true beauty comes from within. Our mission
                is to create products that not only enhance your natural radiance but also nourish
                your soul with every application.
              </p>

              {/* Feature List */}
              <div className="mb-8 space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 lg:items-center">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-primary-200">
                      <Icon name={feature.icon} className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button variant="primary" size="lg" className="w-full sm:w-auto lg:mx-0">
                Learn Our Story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
