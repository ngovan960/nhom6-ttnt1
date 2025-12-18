import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';
import ProductCard from './ProductCard';

interface SearchResultsPageProps {
  query: string;
  results: Product[];
  onBack: () => void;
  onSuggestionClick: (term: string) => void;
  bestSellers: Product[];
  onProductClick: (product: Product) => void;
}

const SearchProductCard: React.FC<{ product: Product; onClick: (p: Product) => void }> = ({ product, onClick }) => (
  <div 
    onClick={() => onClick(product)}
    className="group relative flex flex-col rounded-2xl bg-white dark:bg-[#1a1a0f] border border-[#e6e6db] dark:border-[#3a3a2a] overflow-hidden hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
  >
    {/* Badges */}
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      {product.isNew && (
        <span className="bg-primary text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Mới</span>
      )}
      {product.discount && (
        <span className="bg-[#ef4444] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">-{product.discount}%</span>
      )}
    </div>
    {/* Fav Button */}
    <button className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center hover:bg-primary hover:text-black transition-colors backdrop-blur-sm text-[#181811] dark:text-white">
      <span className="material-symbols-outlined text-[18px]">favorite</span>
    </button>
    {/* Image */}
    <div className="relative aspect-[4/3] w-full bg-[#f8f8f5] dark:bg-[#23220f] overflow-hidden p-6 flex items-center justify-center">
      <img 
        alt={product.name} 
        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" 
        src={product.image} 
      />
    </div>
    {/* Content */}
    <div className="flex flex-col flex-1 p-4">
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`material-symbols-outlined text-[14px] ${star <= Math.round(product.rating) ? 'text-primary fill-current' : 'text-[#e6e6db]'}`}
          >
            star
          </span>
        ))}
        <span className="text-xs text-[#8c8b5f] ml-1">({product.reviews})</span>
      </div>
      <h3 className="text-base font-semibold text-[#181811] dark:text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <div className="mt-auto pt-2">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-lg font-bold text-[#181811] dark:text-white">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-[#8c8b5f] line-through mb-1">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
        <div className="flex justify-between items-center mt-3">
          <label className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary size-4 bg-transparent" />
            <span className="text-xs font-medium text-[#8c8b5f]">So sánh</span>
          </label>
          <button className="bg-[#181811] dark:bg-white text-white dark:text-black hover:bg-primary hover:text-black dark:hover:bg-primary font-bold text-xs px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, results, onBack, onSuggestionClick, bestSellers, onProductClick }) => {
  const suggestions = [
    { icon: 'trending_up', text: 'Macbook Air M3' },
    { icon: 'smartphone', text: 'iPhone 15 Pro' },
    { icon: 'headphones', text: 'Tai nghe Sony' },
    { icon: 'mouse', text: 'Chuột Logitech' },
    { icon: 'keyboard', text: 'Keychron K2' },
  ];

  if (results.length === 0) {
    return (
      <div className="w-full">
        {/* Empty State */}
        <section className="flex flex-col items-center justify-center py-10 animate-fade-in mb-12">
          <div className="flex flex-col items-center gap-8 max-w-[600px]">
            <div className="relative bg-center bg-no-repeat bg-cover rounded-full aspect-square w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-[#f8f8f5] dark:bg-[#23220f] border-4 border-white dark:border-[#1f1e0d] shadow-xl">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl"></div>
              <span className="material-symbols-outlined text-[80px] md:text-[100px] text-gray-300 dark:text-gray-600">search_off</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <h1 className="text-[#181811] dark:text-white text-2xl md:text-3xl font-bold leading-tight">
                Không tìm thấy kết quả cho "{query}"
              </h1>
              <p className="text-[#8c8b5f] dark:text-[#a0a090] text-base font-normal leading-normal max-w-[480px]">
                Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với từ khóa của bạn.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button 
                onClick={onBack}
                className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-full h-11 px-6 bg-primary hover:bg-[#e6e205] text-[#181811] text-sm font-bold tracking-wide transition-transform hover:scale-105 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px] mr-2">home</span>
                <span>Về trang chủ</span>
              </button>
              <button 
                onClick={onBack}
                className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-full h-11 px-6 bg-white dark:bg-[#343323] border border-[#e5e5e0] dark:border-[#3a3a2a] hover:bg-gray-50 dark:hover:bg-[#454433] text-[#181811] dark:text-white text-sm font-bold tracking-wide transition-colors shadow-sm"
              >
                <span>Xem tất cả sản phẩm</span>
              </button>
            </div>
          </div>
        </section>

        {/* Search Suggestions */}
        <section className="flex flex-col gap-6 mb-12">
          <div className="flex items-center justify-between border-b border-[#e5e5e0] dark:border-[#3a3a2a] pb-2">
            <h2 className="text-[#181811] dark:text-white text-xl font-bold">Gợi ý tìm kiếm</h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {suggestions.map((item, index) => (
              <button 
                key={index}
                onClick={() => onSuggestionClick(item.text)}
                className="group flex h-9 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#2a291c] border border-[#e5e5e0] dark:border-[#3a3a2a] pl-4 pr-4 hover:border-primary hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-primary">{item.icon}</span>
                <span className="text-sm font-medium dark:text-white group-hover:text-primary">{item.text}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Best Sellers Grid */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#181811] dark:text-white text-2xl font-bold tracking-tight">Sản phẩm bán chạy</h2>
            <a className="text-sm font-semibold text-[#181811] dark:text-white underline decoration-primary decoration-2 underline-offset-4 hover:text-primary transition-colors" href="#">Xem thêm</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} onClick={onProductClick} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // View with results
  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={onBack} className="text-[#8c8b5f] hover:text-primary transition-colors text-sm font-medium">Trang chủ</button>
        <span className="text-[#8c8b5f] text-sm">/</span>
        <button className="text-[#8c8b5f] hover:text-primary transition-colors text-sm font-medium">Laptop</button>
        <span className="text-[#8c8b5f] text-sm">/</span>
        <span className="text-[#181811] dark:text-white text-sm font-semibold">Kết quả tìm kiếm</span>
      </div>

      {/* Page Heading & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-[#181811] dark:text-white text-3xl font-bold leading-tight mb-2">Tìm thấy {results.length} sản phẩm cho '{query}'</h1>
          <p className="text-[#8c8b5f] text-sm">Hiển thị kết quả phù hợp nhất với tìm kiếm của bạn.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          <button className="flex items-center gap-2 px-4 h-10 rounded-full bg-white dark:bg-[#2a2a1f] border border-[#e6e6db] dark:border-[#3a3a2a] hover:border-primary transition-colors whitespace-nowrap shadow-sm">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            <span className="text-sm font-medium text-[#181811] dark:text-white">Sắp xếp: Phổ biến nhất</span>
          </button>
          <div className="flex bg-[#f5f5f0] dark:bg-[#2a2a1f] p-1 rounded-full gap-1 border border-[#e6e6db] dark:border-[#3a3a2a]">
            <button className="size-8 flex items-center justify-center rounded-full bg-white dark:bg-[#3a3a2a] shadow-sm text-[#181811] dark:text-white">
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button className="size-8 flex items-center justify-center rounded-full text-[#8c8b5f] hover:bg-white/50 dark:hover:bg-[#3a3a2a]/50 transition-colors">
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar & Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6">
          {/* Active Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#181811] dark:text-white">Bộ lọc</h3>
              <button className="text-xs font-semibold text-primary underline decoration-primary/50">Xóa tất cả</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="flex h-7 items-center gap-1 rounded-full bg-[#181811] dark:bg-white text-white dark:text-[#181811] px-3 text-xs font-medium">
                Apple <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
              <button className="flex h-7 items-center gap-1 rounded-full bg-[#f5f5f0] dark:bg-[#2a2a1f] border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white px-3 text-xs font-medium">
                Trên 20tr <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          </div>
          <hr className="border-[#e6e6db] dark:border-[#3a3a2a]"/>
          
          {/* Category Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center cursor-pointer group">
              <h4 className="font-semibold text-sm text-[#181811] dark:text-white">Danh mục</h4>
              <span className="material-symbols-outlined text-[20px] text-[#8c8b5f] group-hover:text-[#181811] dark:group-hover:text-white transition-colors">expand_less</span>
            </div>
            <div className="flex flex-col gap-2 pl-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input defaultChecked type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary size-4" />
                <span className="text-sm text-[#181811] dark:text-white group-hover:text-primary transition-colors">Laptop ({results.length})</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary size-4" />
                <span className="text-sm text-[#5c5b4f] dark:text-[#a0a090] group-hover:text-primary transition-colors">Phụ kiện (42)</span>
              </label>
            </div>
          </div>
          <hr className="border-[#e6e6db] dark:border-[#3a3a2a]"/>

          {/* Price Filter */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center cursor-pointer group">
              <h4 className="font-semibold text-sm text-[#181811] dark:text-white">Khoảng giá</h4>
              <span className="material-symbols-outlined text-[20px] text-[#8c8b5f]">expand_less</span>
            </div>
            <div className="px-2">
              <div className="relative h-1 w-full bg-[#e6e6db] dark:bg-[#3a3a2a] rounded-full">
                <div className="absolute left-0 top-0 h-full w-2/3 bg-primary rounded-full"></div>
                <div className="absolute -top-1.5 -ml-1.5 left-2/3 size-4 rounded-full bg-[#181811] dark:bg-primary border-2 border-white cursor-pointer shadow-md"></div>
              </div>
              <div className="flex justify-between mt-3 text-xs font-medium text-[#8c8b5f]">
                <span>0đ</span>
                <span>50.000.000đ</span>
              </div>
            </div>
            <div className="flex gap-2">
              <input className="w-full rounded-lg bg-[#f5f5f0] dark:bg-[#2a2a1f] border-transparent text-sm py-1.5 px-3 focus:border-primary focus:ring-0 text-[#181811] dark:text-white" placeholder="Từ" type="number"/>
              <input className="w-full rounded-lg bg-[#f5f5f0] dark:bg-[#2a2a1f] border-transparent text-sm py-1.5 px-3 focus:border-primary focus:ring-0 text-[#181811] dark:text-white" placeholder="Đến" type="number"/>
            </div>
          </div>
          <hr className="border-[#e6e6db] dark:border-[#3a3a2a]"/>

          {/* RAM Filter */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center cursor-pointer group">
              <h4 className="font-semibold text-sm text-[#181811] dark:text-white">RAM</h4>
              <span className="material-symbols-outlined text-[20px] text-[#8c8b5f]">expand_less</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 rounded-full border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white text-xs font-medium hover:border-primary hover:bg-primary/10 transition-colors">8GB</button>
              <button className="px-3 py-1 rounded-full bg-primary text-black border border-primary text-xs font-bold">16GB</button>
              <button className="px-3 py-1 rounded-full border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white text-xs font-medium hover:border-primary hover:bg-primary/10 transition-colors">32GB</button>
              <button className="px-3 py-1 rounded-full border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white text-xs font-medium hover:border-primary hover:bg-primary/10 transition-colors">64GB</button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Quick Filters (Chips) */}
          <div className="flex gap-3 mb-6 overflow-x-auto hide-scrollbar pb-2">
            {['Giao nhanh 2h', 'Trả góp 0%', 'Màn hình Retina', 'Chip M2'].map((label, idx) => (
              <button key={idx} className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f5f5f0] dark:bg-[#2a2a1f] border border-transparent hover:border-primary px-4 transition-all">
                <p className="text-sm font-medium leading-normal text-[#181811] dark:text-white">{label}</p>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((product) => (
              <SearchProductCard key={product.id} product={product} onClick={onProductClick} />
            ))}
            {/* Add some skeleton loaders to fill grid for demo purpose if few results */}
            {results.length < 3 && Array(3).fill(0).map((_, i) => (
              <div key={`skeleton-${i}`} className="flex flex-col rounded-2xl bg-white dark:bg-[#1a1a0f] border border-[#e6e6db] dark:border-[#3a3a2a] overflow-hidden">
                <div className="relative aspect-[4/3] w-full bg-[#f5f5f0] dark:bg-[#23220f] animate-pulse"></div>
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div className="h-3 w-1/3 bg-[#f5f5f0] dark:bg-[#23220f] rounded animate-pulse"></div>
                  <div className="h-5 w-full bg-[#f5f5f0] dark:bg-[#23220f] rounded animate-pulse"></div>
                  <div className="h-5 w-2/3 bg-[#f5f5f0] dark:bg-[#23220f] rounded animate-pulse"></div>
                  <div className="mt-auto pt-2 gap-2 flex flex-col">
                    <div className="h-6 w-1/2 bg-[#f5f5f0] dark:bg-[#23220f] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <button className="size-10 flex items-center justify-center rounded-full border border-[#e6e6db] dark:border-[#3a3a2a] text-[#8c8b5f] hover:border-primary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="size-10 flex items-center justify-center rounded-full bg-primary text-black font-bold">1</button>
              <button className="size-10 flex items-center justify-center rounded-full border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white hover:border-primary hover:text-primary transition-colors">2</button>
              <button className="size-10 flex items-center justify-center rounded-full border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white hover:border-primary hover:text-primary transition-colors">3</button>
              <span className="flex items-center justify-center w-8 text-[#8c8b5f]">...</span>
              <button className="size-10 flex items-center justify-center rounded-full border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white hover:border-primary hover:text-primary transition-colors">12</button>
              <button className="size-10 flex items-center justify-center rounded-full border border-[#e6e6db] dark:border-[#3a3a2a] text-[#8c8b5f] hover:border-primary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;