import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../constants';
import { useCartStore } from '../store/useCartStore';

interface CartItem {
  id: number; // product id
  name: string;
  variant?: string;
  price: number;
  image?: string;
  quantity: number;
  stock?: number;
}

interface CartPageProps {
  onBack: () => void;
  onCheckout?: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ onBack, onCheckout }) => {
  const itemsFromStore = useCartStore((s) => s.items);
  const loading = useCartStore((s) => s.loading);
  const loadCart = useCartStore((s) => s.loadCart);
  const updateItemStore = useCartStore((s) => s.updateItem);
  const removeItemStore = useCartStore((s) => s.removeItem);
  const addItemStore = useCartStore((s) => s.addItem);
  const [items, setItems] = useState<CartItem[]>(itemsFromStore);

  const recommendations = [
    {
      id: 101,
      name: "Apple Watch Ultra 2",
      price: 21990000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9qUJEw5CF3g8gaWHumeioSbCmsm2kTJeTTHk-KvpOIAHf6B6rQGwctdFM9-Ez1vwrJJQCma4t6mqpQTjZVOQpRWJttFVcOdocxCgUd7x-KUPLAGsAk9ak_eM_-aMagFYXBN4r7GwXNO1z9TPHQsnWZyRUJ1te0GDTpAkop_E3taX4dUJlNeT5VgScS8Ro3IbHAsetBu7X8lQktIM6HYajiW0Xr1wBtOWdabRhW6kViT9tK417AE2LLuo-DL4mZgxhpIYC2wM6MCjt"
    },
    {
      id: 102,
      name: "Tai nghe Sony WH-1000XM5",
      price: 7990000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAtaeSEaOtlm2-FmPK_PCJGFFm-0SrpIG08_2KHYWrWIiFBRPmnKgG5LaflS4Io73MKdB6DsLXil52yK5PXikBt5b9rKV-1YFacSL82mOGfxqTQYLTA_qomPOgmUOW2OxjaKKNFOtZdnqy-NOhCsgxRREPYwPiL9uejjkkPCYCIFCGoHVxJ9CVukuTVyetWYVLw6tUyi5QdWE_uG2JRM6bwAN-Zn7-l84lKhxSgl2zxawbxk4eZt5jXeVV0JPR2UJMozbQ8FpquAfp"
    },
    {
      id: 103,
      name: "iPad Air 5 M1 Wifi 64GB",
      price: 14490000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-Kvub34AQKoo1WRmR5QqZVZYtJNhgiYKbX9NYEDpDgqbFsbiYt6HIOiP3AVMMiBBSKitVXd9WI5Gag9wRXkvONDZFakbqbZcXs_JLZ_4kdtE9_aeZttFUZVzo785Yclpd_KGvQqRq--34rj9LEvqsTNWxCbiDWS3oTYmiC_laC7vwZzsHOYTipNZL2mYpezzsC0NdQStMUcx1wRYbqOrOy01YTu_4WjY8FrBqY4hxz7sjGykvH_ckC2OYJw63It8FdokELsv6zm-S"
    },
    {
      id: 104,
      name: "Bàn phím cơ Keychron K2 Pro",
      price: 2290000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD8lF_Le5Psa51F5HyNa7Ze0_5XRL3DC-BEVFhmVYfbpZoG-ISVecZlcgACse6OmWdJVxb7kjXa2g7RikPqFG_0nh5VzNaaXw44WkjuOnFx5u3k0V74kn1NV-xrUojut67cKJqRPzO0IbjX51087sXdGuNobpSV4XhqdRClu1sxqPRKyX6BDV0itkZtgv2rEnP501EAfXRHMA5TxOObW9ATYzYttt9imaPnGmYjP_p7SybCBonw9RQMoZP9PU6tYl5E0xZaxkPg0Qz"
    }
  ];

  useEffect(() => {
    // initialize store/cart on mount
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    setItems(itemsFromStore);
  }, [itemsFromStore]);

  const updateQuantity = async (id: number, change: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (change > 0) {
      try {
        await addItemStore(id, 1);
      } catch (err) {
        alert(err?.message || 'Không thể tăng số lượng');
      }
    } else {
      try {
        await updateItemStore(id, 'decrease');
      } catch (err) {
        alert(err?.message || 'Không thể giảm số lượng');
      }
    }
  };

  const removeItem = async (id: number) => {
    try {
      await removeItemStore(id);
    } catch (err) {
      alert(err?.message || 'Không thể xóa sản phẩm');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6 lg:py-10 font-display">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={onBack} className="text-[#6f6189] text-sm font-medium hover:text-primary transition-colors">Trang chủ</button>
        <span className="text-[#6f6189] text-sm font-medium">/</span>
        <span className="text-[#131118] dark:text-white text-sm font-medium">Giỏ hàng</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Cart Items */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-end gap-3 pb-2 border-b border-[#f2f0f4] dark:border-gray-800">
            <h1 className="text-[#131118] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Giỏ hàng <span className="text-xl font-medium text-[#6f6189] align-middle ml-2">({items.length} sản phẩm)</span>
            </h1>
          </div>

          {/* Product List */}
          <div className="flex flex-col gap-4">
            {items.map(item => (
              <div key={item.id} className="group relative flex flex-col sm:flex-row gap-4 bg-white dark:bg-[#1f1a2e] p-4 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow border border-transparent dark:border-gray-800">
                <div className="shrink-0 relative">
                  <div
                    className="bg-gray-100 aspect-square w-full sm:w-[100px] h-[100px] rounded-[1rem] bg-cover bg-center"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  ></div>
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-[#131118] dark:text-white text-lg font-bold leading-tight mb-1">{item.name}</h3>
                      <p className="text-[#6f6189] text-sm font-normal">{item.variant}</p>
                      <div className="mt-2 text-primary font-bold text-lg">{formatCurrency(item.price)}</div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#6f6189] hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4 sm:mt-0">
                    <div className="flex items-center gap-3 bg-[#f6f6f8] dark:bg-gray-800 rounded-full px-2 py-1 w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="size-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-50 text-[#131118] dark:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <input
                        className="w-8 p-0 text-center bg-transparent border-none focus:ring-0 text-[#131118] dark:text-white font-bold text-sm"
                        readOnly
                        type="number"
                        value={item.quantity}
                      />
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="size-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-50 text-[#131118] dark:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                    <span className="sm:hidden text-sm font-bold text-[#131118] dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-24">
          <div className="bg-white dark:bg-[#1f1a2e] rounded-[1.5rem] p-6 shadow-sm border border-transparent dark:border-gray-800">
            <h3 className="text-[#131118] dark:text-white text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-[#6f6189] dark:text-gray-400">
                <span className="text-base">Tạm tính</span>
                <span className="text-[#131118] dark:text-white font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[#6f6189] dark:text-gray-400">
                <span className="text-base">Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between items-center text-[#6f6189] dark:text-gray-400">
                <span className="text-base">Giảm giá</span>
                <span className="text-[#131118] dark:text-white font-medium">-0đ</span>
              </div>
            </div>
            {/* Coupon Input */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <input className="w-full bg-[#f6f6f8] dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm text-[#131118] dark:text-white placeholder:text-[#6f6189] focus:ring-2 focus:ring-primary/20" placeholder="Mã giảm giá" />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-[#6f6189] text-[20px]">local_offer</span>
              </div>
              <button className="bg-[#f6f6f8] dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#131118] dark:text-white font-bold rounded-xl px-4 text-sm transition-colors">Áp dụng</button>
            </div>
            <div className="h-px w-full bg-[#f2f0f4] dark:bg-gray-800 mb-6"></div>
            <div className="flex justify-between items-end mb-6">
              <span className="text-[#131118] dark:text-white text-lg font-bold">Tổng cộng</span>
              <div className="text-right">
                <span className="block text-2xl font-black text-primary tracking-tight">{formatCurrency(subtotal)}</span>
                <span className="text-xs text-[#6f6189]">(Đã bao gồm VAT)</span>
              </div>
            </div>
            <button onClick={() => onCheckout ? onCheckout() : null} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full text-base tracking-wide shadow-lg shadow-primary/30 transition-all active:scale-[0.98]">
              Tiến hành thanh toán
            </button>
            <div className="flex justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-xs text-[#6f6189] font-medium">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                Bảo mật 100%
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#6f6189] font-medium">
                <span className="material-symbols-outlined text-[16px]">assignment_return</span>
                Đổi trả 30 ngày
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="mt-16 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#131118] dark:text-white text-2xl font-bold">Có thể bạn sẽ thích</h3>
          <a className="text-primary text-sm font-bold flex items-center hover:underline" href="#">
            Xem tất cả
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map(rec => (
            <div key={rec.id} className="bg-white dark:bg-[#1f1a2e] p-4 rounded-[1.5rem] flex flex-col gap-3 group cursor-pointer hover:shadow-lg transition-all duration-300">
              <div className="relative bg-[#f6f6f8] dark:bg-gray-800 rounded-xl aspect-[4/3] w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url("${rec.image}")` }}
                ></div>
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary block">favorite</span>
                </div>
              </div>
              <div>
                <h4 className="text-[#131118] dark:text-white font-bold text-sm md:text-base line-clamp-2 min-h-[3rem]">{rec.name}</h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-bold">{formatCurrency(rec.price)}</span>
                  <button className="bg-primary text-white rounded-full p-2 hover:bg-primary/90 transition-colors">
                    <span className="material-symbols-outlined text-[18px] block">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;