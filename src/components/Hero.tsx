import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { MenuItem } from '../types';

interface HeroProps {
  featuredDishes: MenuItem[];
}

export function Hero({ featuredDishes }: HeroProps) {
  return (
    <section className="relative min-h-screen pt-20">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Restaurant ambiance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Experience Culinary Excellence
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Discover a world of exquisite flavors and unforgettable dining experiences at Savoria.
        </p>
        <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition-colors inline-flex items-center gap-2">
          Reserve Your Table <ArrowRight size={20} />
        </button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/20 transition-colors cursor-pointer group"
            >
              <img
                src={dish.image_url}
                alt={dish.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                <p className="text-gray-200 mb-4">{dish.description}</p>
                <p className="text-orange-400 font-semibold">${dish.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}