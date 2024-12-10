import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function CategoryTree({ categories, selectedCategory, onSelectCategory, level = 0 }) {
  const [expandedCategories, setExpandedCategories] = React.useState(new Set());

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getSubcategories = (parentId) => {
    return categories.filter(category => category.parent_id === parentId);
  };

  const renderCategory = (category) => {
    const subcategories = getSubcategories(category.id);
    const isExpanded = expandedCategories.has(category.id);
    const hasSubcategories = subcategories.length > 0;

    return (
      <motion.div
        key={category.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer ${
            selectedCategory === category.id
              ? 'bg-indigo-50 text-indigo-600'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          {hasSubcategories && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.id);
              }}
              className="p-1 rounded-full hover:bg-gray-100 mr-1"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </button>
          )}
          <span className="text-sm font-medium">{category.name}</span>
        </div>

        {isExpanded && hasSubcategories && (
          <div className="ml-4">
            {subcategories.map((subcategory) => (
              <CategoryTree
                key={subcategory.id}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
                level={level + 1}
                category={subcategory}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-1">
      {categories
        .filter(category => !category.parent_id)
        .map(renderCategory)}
    </div>
  );
}

export default CategoryTree;