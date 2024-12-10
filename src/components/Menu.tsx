import React from 'react';
import type { MenuItem, Category } from '../types';

interface MenuProps {
  categories: Category[];
  menuItems: MenuItem[];
}

export function Menu({ categories, menuItems }: MenuProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(null);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory && item.category_id !== selectedCategory) return false;
    if (selectedTags.length > 0 && !selectedTags.every(tag => item.dietary_tags.includes(tag))) return false;
    return true;
  });

  const allTags = Array.from(new Set(menuItems.flatMap(item => item.dietary_tags)));

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Our Menu</h2>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === null ? 'bg-orange-600 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category.id ? 'bg-orange-600 text-white' : 'bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTags(prev =>
                  prev.includes(tag)
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-orange-600 font-semibold">${item.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    {item.dietary_tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}