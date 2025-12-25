import React from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';
import { useCompareStore } from '@/store/useCompareStore';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(product)}
      className="group flex flex-col bg-white dark:bg-[#2a291c] p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer"
    >
      <div className="relative w-full aspect-square bg-[#f5f5f0] dark:bg-[#343323] rounded-xl mb-4 overflow-hidden">
        {/* Badges */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-[#ff4d4f] text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
            -{product.discount}%
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-[#181811] text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
            New
          </div>
        )}

        <img
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
          src={product.images && product.images.length > 0 ? product.images[0] : product.image}
        />

        <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              useCompareStore.getState().addItem(product);
            }}
            className="size-10 rounded-full bg-white dark:bg-black text-[#181811] dark:text-white shadow-md flex items-center justify-center translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-secondary hover:text-black"
            title="So sánh"
          >
            <span className="material-symbols-outlined">compare_arrows</span>
          </button>
          <button className="size-10 rounded-full bg-white dark:bg-black text-[#181811] dark:text-white shadow-md flex items-center justify-center translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-black">
            <span className="material-symbols-outlined">add_shopping_cart</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <p className="text-xs font-bold text-[#8c8b5f] dark:text-[#bebdb0] uppercase tracking-wide">
          {product.brand}
        </p>
        <h3 className="text-base font-bold text-[#181811] dark:text-white line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
          <span className="text-xs font-medium text-[#5e5d4a] dark:text-[#bebdb0]">
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="flex items-end gap-2 mt-auto">
          <span className="text-lg font-bold text-[#181811] dark:text-white">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#8c8b5f] dark:text-[#707060] line-through mb-0.5">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;