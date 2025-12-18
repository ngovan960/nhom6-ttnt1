import React, { useState } from 'react';
import { formatCurrency } from '../constants';

interface FavoritesPageProps {
  onBack: () => void;
  onCartClick: () => void; // Added to handle navigation to cart if needed, though usually global header handles this
}

type ProductStatus = 'in-stock' | 'out-of-stock' | 'discount';

interface FavoriteProduct {
  id: number;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  status: ProductStatus;
  discountPercent?: number;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data based on the design
  const [products, setProducts] = useState<FavoriteProduct[]>([
    {
      id: 1,
      brand: 'Apple',
      name: 'MacBook Air M2 2022 13.6 inch 8GB/256GB - Midnight',
      price: 26990000,
      originalPrice: 28990000,
      image: '',
      status: 'in-stock'
    },
    {
      id: 2,
      brand: 'Samsung',
      name: 'Samsung Galaxy S23 Ultra 5G 256GB - Tím Lilac',
      price: 21490000,
      originalPrice: 26990000,
      image: '',
      status: 'discount',
      discountPercent: 15
    },
    {
      id: 3,
      brand: 'Sony',
      name: 'Tai nghe chụp tai Sony WH-1000XM5 Chống ồn',
      price: 6490000,
      image: '',
      status: 'out-of-stock'
    },
    {
      id: 4,
      brand: 'Logitech',
      name: 'Chuột không dây Logitech MX Master 3S',
      price: 2190000,
      originalPrice: 2490000,
      image: '',
      status: 'in-stock'
    },
    {
      id: 5,
      brand: 'Apple',
      name: 'iPad Air 5 M1 10.9 inch WiFi 64GB',
      price: 14490000,
      image: '',
      status: 'in-stock'
    }
  ]);

  const removeProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const renderBadge = (product: FavoriteProduct) => {
    switch (product.status) {
      case 'out-of-stock':
        return (
          <div className="absolute top-3 left-3 z-10 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            TẠM HẾT HÀNG
          </div>
        );
      case 'discount':
        return (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            -{product.discountPercent}%
          </div>
        );
      default: // in-stock
        return (
          <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded">
            CÒN HÀNG
          </div>
        );
    }
  };

  const filters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'laptop', label: 'Laptop' },
    { id: 'phone', label: 'Điện thoại' },
    { id: 'accessories', label: 'Phụ kiện' },
    { id: 'tablet', label: 'Tablet' },
  ];

  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 font-inter">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button onClick={onBack} className="text-[#60608a] hover:text-[#0d0df2] transition-colors">Trang chủ</button>
        <span className="text-[#60608a] material-symbols-outlined text-[12px]">arrow_forward_ios</span>
        <button onClick={onBack} className="text-[#60608a] hover:text-[#0d0df2] transition-colors">Tài khoản</button>
        <span className="text-[#60608a] material-symbols-outlined text-[12px]">arrow_forward_ios</span>
        <span className="text-[#111118] font-medium dark:text-white">Sản phẩm yêu thích</span>
      </div>

      {/* Page Heading & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#111118] dark:text-white tracking-tight mb-2">Sản phẩm yêu thích</h1>
          <p className="text-[#60608a] dark:text-gray-400 font-medium">Bạn có {products.length} sản phẩm trong danh sách</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Sort Dropdown */}
          <div className="relative min-w-[200px]">
            <select className="appearance-none w-full h-11 pl-4 pr-10 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#111118] dark:text-white focus:outline-none focus:border-[#0d0df2] focus:ring-1 focus:ring-[#0d0df2] cursor-pointer">
              <option value="newest">Mới thêm gần đây</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="name">Tên: A-Z</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#60608a]">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters (Chips) */}
      <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-[#e5e5ea] dark:border-gray-800">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              h-9 px-5 rounded-full text-sm font-medium transition-all
              ${activeFilter === filter.id
                ? 'bg-[#111118] text-white hover:opacity-90 dark:bg-white dark:text-[#111118]'
                : 'bg-white dark:bg-[#1a1a2e] border border-[#e5e5ea] dark:border-gray-700 text-[#60608a] dark:text-gray-400 hover:border-[#0d0df2] hover:text-[#0d0df2]'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="group relative flex flex-col bg-white dark:bg-[#1e1e2d] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800">
            {/* Image Area */}
            <div className="relative aspect-[4/3] bg-[#f8f9fa] dark:bg-gray-900 p-6 flex items-center justify-center overflow-hidden">
              {renderBadge(product)}
              <button
                onClick={() => removeProduct(product.id)}
                aria-label="Xóa khỏi yêu thích"
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors backdrop-blur-sm shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
              <img
                alt={product.name}
                className={`object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500 ${product.status === 'out-of-stock' ? 'grayscale opacity-80' : ''}`}
                src={product.image}
              />
            </div>
            {/* Content Area */}
            <div className="p-4 flex flex-col flex-1">
              <div className="mb-1 text-xs text-[#60608a] font-medium">{product.brand}</div>
              <a href="#" className="text-[#111118] dark:text-white font-bold text-base leading-snug hover:text-[#0d0df2] line-clamp-2 mb-2 min-h-[44px]">
                {product.name}
              </a>
              <div className="flex items-end gap-2 mt-auto mb-4">
                <span className="text-[#0d0df2] text-lg font-bold">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-[#60608a] text-xs line-through mb-1">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>

              {product.status === 'out-of-stock' ? (
                <button
                  disabled
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                  Nhận tin khi có hàng
                </button>
              ) : (
                <button className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-[#0d0df2] text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  Thêm vào giỏ
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination / Load More */}
      <div className="mt-12 flex justify-center">
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[#111118] font-medium transition-colors shadow-sm dark:bg-[#1a1a2e] dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
          Xem thêm sản phẩm
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </div>
    </div>
  );
};

export default FavoritesPage;