import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../constants';
import { wishlistService, WishlistItem } from '../services/wishlist.service';
import { useAuthStore } from '../store/useAuthStore';

interface FavoritesPageProps {
  onBack: () => void;
  onCartClick: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.id) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await wishlistService.getWishlist(user!.id);
      setWishlistItems(data || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (productId: number) => {
    if (!user?.id) return;
    try {
      await wishlistService.removeFromWishlist(productId, user.id);
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (err) {
      alert('Xóa sản phẩm thất bại');
    }
  };

  const filters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'laptop', label: 'Laptop' },
    { id: 'phone', label: 'Điện thoại' },
    { id: 'accessories', label: 'Phụ kiện' },
    { id: 'tablet', label: 'Tablet' },
  ];

  if (loading) {
    return (
      <div className="flex-grow w-full flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d0df2]"></div>
      </div>
    );
  }

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
          <p className="text-[#60608a] dark:text-gray-400 font-medium">Bạn có {wishlistItems.length} sản phẩm trong danh sách</p>
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
      {wishlistItems.length === 0 ? (
        <div className="py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">favorite</span>
          <p className="text-[#60608a] text-lg">Danh sách yêu thích của bạn đang trống.</p>
          <button onClick={onBack} className="mt-6 text-[#0d0df2] font-bold hover:underline">Tiếp tục mua sắm</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(item => {
            const product = item.Product;
            return (
              <div key={product.id} className="group relative flex flex-col bg-white dark:bg-[#1e1e2d] rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800">
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-[#f8f9fa] dark:bg-gray-900 p-6 flex items-center justify-center overflow-hidden">
                  <button
                    onClick={() => removeProduct(product.id)}
                    aria-label="Xóa khỏi yêu thích"
                    className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors backdrop-blur-sm shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                  <img
                    alt={product.name}
                    className="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                    src={product.image}
                  />
                </div>
                {/* Content Area */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-1 text-xs text-[#60608a] font-medium">{product.brand || 'TechZone'}</div>
                  <h3 className="text-[#111118] dark:text-white font-bold text-base leading-snug hover:text-[#0d0df2] line-clamp-2 mb-2 min-h-[44px]">
                    {product.name}
                  </h3>
                  <div className="flex items-end gap-2 mt-auto mb-4">
                    <span className="text-[#0d0df2] text-lg font-bold">{formatCurrency(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-[#60608a] text-xs line-through mb-1">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>

                  <button className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-[#0d0df2] text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;