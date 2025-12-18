import React, { useState } from 'react';
import { CATEGORIES } from '../constants';

interface Props {
  onSelect?: (categoryId: string) => void;
}

const CategoryChips: React.FC<Props> = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const handleClick = (id: string) => {
    setActiveCategory(id);
    onSelect?.(id);
  };

  return (
    <div className="mb-10">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleClick(category.id)}
              className={`
                group flex h-10 shrink-0 items-center gap-2 rounded-full px-5 transition-all snap-start active:scale-95 border
                ${isActive
                  ? 'bg-[#181811] text-white border-[#181811] shadow-md'
                  : 'bg-white dark:bg-[#2a291c] border-[#e5e5e0] dark:border-[#3a392a] hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/5'
                }
              `}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : 'text-[#5e5d4a] dark:text-[#bebdb0] group-hover:text-primary'}`}>
                {category.icon}
              </span>
              <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium text-[#181811] dark:text-white'}`}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChips;