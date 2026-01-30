import React, { useState } from 'react';
import type { Ingredient } from '../../types/productDetails';

interface IngredientsListProps {
  ingredients: Ingredient[];
  fullIngredientsList?: string[];
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients, fullIngredientsList }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-white dark:bg-white/5 p-10 rounded-xl shadow-sm border border-primary/5">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-rounded text-primary text-2xl">biotech</span>
        <h3 className="text-xl font-serif text-gray-900 dark:text-white">Key Ingredients</h3>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
        Our carefully selected ingredients work together to nourish and protect your skin, leaving
        it feeling soft, smooth, and radiant.
      </p>

      <div className="grid-cols-2 gap-6 hidden md:grid">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary font-bold text-sm w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              {String(ingredient.number || 1).padStart(2, '0')}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {ingredient.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {ingredient.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 md:hidden">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary font-bold text-sm w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              {String(ingredient.number || 1).padStart(2, '0')}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {ingredient.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {ingredient.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {fullIngredientsList && fullIngredientsList.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
          >
            <span className="material-symbols-rounded text-lg">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
            {isExpanded ? 'Show Less' : 'View Full Ingredients List'}
          </button>

          {/* Full Ingredients List */}
          {isExpanded && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Full Ingredients List
              </h4>
              <div className="space-y-2">
                {fullIngredientsList.map((ingredient, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    • {ingredient}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientsList;
