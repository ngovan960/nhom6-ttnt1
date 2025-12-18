import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../constants';
import ProductCard from './ProductCard';
import { cartService } from '../services/cart.service';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  relatedProducts: Product[];
  onProductClick: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, relatedProducts, onProductClick }) => {
  // derive gallery images from the product's images array if available; fallback to single image or related products
  const images = Array.from(
    new Set(
      [
        ...(product.images && product.images.length ? product.images : (product.image ? [product.image] : [])),
        ...(relatedProducts || []).flatMap((p) => (p.images && p.images.length ? p.images : (p.image ? [p.image] : [])))
      ].filter(Boolean)
    )
  );

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  // removed color/config variants per request

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full font-display">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-sm mb-6 text-[#8c8b5f]">
        <button onClick={onBack} className="hover:text-[#181811] dark:hover:text-white transition-colors">Trang chủ</button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <button className="hover:text-[#181811] dark:hover:text-white transition-colors">Laptop</button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <button className="hover:text-[#181811] dark:hover:text-white transition-colors">MacBook</button>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="font-medium text-[#181811] dark:text-white">{product.name}</span>
      </nav>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 mb-16">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-white dark:bg-[#1a1a0f] rounded-2xl overflow-hidden border border-[#e6e6db] dark:border-[#3a3a2a] p-8 flex items-center justify-center relative group">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-primary text-[#181811] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Mới</span>
              <span className="bg-[#23220f] text-white text-xs font-bold px-3 py-1 rounded-full">-12%</span>
            </div>
            <img
              alt="MacBook Air M2"
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              src={images[activeImage]}
            />
            <button className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-lg border border-[#e6e6db] dark:border-[#3a3a2a] hover:bg-primary hover:text-black transition-colors dark:text-white">
              <span className="material-symbols-outlined">zoom_in</span>
            </button>
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square rounded-xl border-2 ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-[#e6e6db] dark:border-[#3a3a2a] hover:border-[#8c8b5f]'} bg-white dark:bg-[#1a1a0f] p-2 overflow-hidden transition-all`}
              >
                <img className="w-full h-full object-contain" src={img} alt={`Thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex text-primary">
              <span className="material-symbols-outlined fill text-[20px] text-primary">star</span>
              <span className="material-symbols-outlined fill text-[20px] text-primary">star</span>
              <span className="material-symbols-outlined fill text-[20px] text-primary">star</span>
              <span className="material-symbols-outlined fill text-[20px] text-primary">star</span>
              <span className="material-symbols-outlined fill text-[20px] text-[#e6e6db]">star</span>
            </div>
            <span className="text-sm font-medium text-[#181811] dark:text-white underline decoration-[#8c8b5f]/50 underline-offset-4 cursor-pointer">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#181811] dark:text-white mb-4 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-end gap-3 mb-8">
            <p className="text-3xl font-bold text-[#181811] dark:text-white">{formatCurrency(product.price)}</p>
            {product.originalPrice && (
              <p className="text-lg text-[#8c8b5f] line-through mb-1">{formatCurrency(product.originalPrice)}</p>
            )}
          </div>

          {/* variants removed per request */}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-[#8c8b5f]/30 rounded-full bg-white dark:bg-[#1a1a0f] h-12 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-[#181811] dark:text-white hover:bg-[#f8f8f5] dark:hover:bg-[#2a2a1f] rounded-l-full transition-colors"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <input
                className="w-10 text-center font-bold border-none focus:ring-0 p-0 text-[#181811] dark:text-white bg-transparent"
                readOnly
                type="text"
                value={quantity}
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-[#181811] dark:text-white hover:bg-[#f8f8f5] dark:hover:bg-[#2a2a1f] rounded-r-full transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <button
              onClick={async () => {
                const authUser = useAuthStore.getState().user;
                if (!authUser) {
                  alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
                  return;
                }
                if (!product || !product.id) return;
                setCartLoading(true);
                try {
                  await cartService.addItem(product.id, quantity);
                  // refresh global cart store so CartPage updates immediately
                  await useCartStore.getState().loadCart();
                  alert('Đã thêm vào giỏ hàng');
                } catch (err: any) {
                  const msg = err?.message || JSON.stringify(err) || 'Thêm vào giỏ hàng thất bại';
                  alert(msg);
                } finally {
                  setCartLoading(false);
                }
              }}
              disabled={cartLoading}
              className={`flex-1 bg-primary hover:bg-primary/90 text-[#181811] h-12 rounded-full font-bold text-base shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 ${cartLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartLoading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>

            <button className="size-12 rounded-full border border-[#8c8b5f]/30 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all text-[#181811] dark:text-white">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>

          {/* Short Specs: show product.description instead of separate description section */}
          <div className="bg-white dark:bg-[#1a1a0f] rounded-2xl p-5 border border-[#e6e6db] dark:border-[#3a3a2a]">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#8c8b5f] mb-4">Thông số nổi bật</h3>
            {product.description ? (
              <div className="text-sm text-[#181811] dark:text-white leading-relaxed">{product.description}</div>
            ) : (
              <ul className="space-y-3">
                {[
                  { icon: 'memory', label: 'Chip', value: 'Apple M2 (8-core CPU, 8-core GPU)' },
                  { icon: 'laptop_mac', label: 'Màn hình', value: '13.6 inch Liquid Retina (2560 x 1664)' },
                  { icon: 'weight', label: 'Trọng lượng', value: '1.24 kg - Siêu nhẹ' },
                  { icon: 'battery_horiz_075', label: 'Pin', value: 'Lên đến 18 giờ' }
                ].map((spec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#8c8b5f] mt-0.5 text-lg">{spec.icon}</span>
                    <span className="text-sm text-[#181811] dark:text-white"><strong className="font-semibold">{spec.label}:</strong> {spec.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Info Tabs */}
      <div className="border-t border-[#e6e6db] dark:border-[#3a3a2a] pt-10">
        <div className="flex flex-wrap gap-8 border-b border-[#e6e6db] dark:border-[#3a3a2a] mb-8 sticky top-[72px] bg-[#f8f8f5]/95 dark:bg-[#23220f]/95 backdrop-blur z-20">
          <button onClick={() => scrollToSection('specs')} className="pb-4 text-[#181811] dark:text-white font-bold border-b-2 border-primary">Thông số kỹ thuật</button>
          <button onClick={() => scrollToSection('reviews')} className="pb-4 text-[#8c8b5f] font-medium hover:text-[#181811] dark:hover:text-white transition-colors">Đánh giá ({product.reviews})</button>
        </div>

        {/* Description & Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-6 text-[#181811]/80 dark:text-white/80 leading-relaxed" id="desc">
            <h2 className="text-2xl font-bold text-[#181811] dark:text-white">Thiết kế mỏng nhẹ, hiệu năng vượt trội</h2>
            <p>
              MacBook Air M2 2023 mang đến một bước đột phá về thiết kế với vẻ ngoài vuông vức, hiện đại nhưng vẫn giữ được sự mỏng nhẹ đặc trưng.
              Được trang bị chip M2 thế hệ mới, chiếc laptop này không chỉ mạnh mẽ hơn 1.4 lần so với M1 mà còn tiết kiệm điện năng đáng kể.
            </p>
            {(product.images && product.images.length > 0) || product.image ? (
              <div className="rounded-xl overflow-hidden my-6">
                <img className="w-full object-cover" src={(product.images && product.images.length > 0) ? product.images[0] : product.image} alt={product.name} />
              </div>
            ) : null}
            <p>
              Màn hình Liquid Retina 13.6 inch rực rỡ với độ sáng 500 nits, hỗ trợ 1 tỷ màu giúp hình ảnh trở nên sống động và chân thực hơn bao giờ hết.
              Camera FaceTime HD 1080p cùng hệ thống 4 loa âm thanh không gian sẽ nâng tầm trải nghiệm làm việc và giải trí của bạn.
            </p>
            <h3 className="text-xl font-bold text-[#181811] dark:text-white mt-6">Cổng kết nối MagSafe đã trở lại</h3>
            <p>
              Sự trở lại của cổng sạc MagSafe 3 tiện lợi giúp giải phóng 2 cổng Thunderbolt, cho phép bạn kết nối nhiều thiết bị ngoại vi hơn.
            </p>
          </div>

          {/* Specs Table */}
          <div className="bg-white dark:bg-[#1a1a0f] rounded-2xl p-6 h-fit border border-[#e6e6db] dark:border-[#3a3a2a]" id="specs">
            <h3 className="text-lg font-bold mb-4 text-[#181811] dark:text-white">Thông số chi tiết</h3>
            <div className="overflow-hidden rounded-lg border border-[#e6e6db] dark:border-[#3a3a2a]">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-[#e6e6db] dark:divide-[#3a3a2a]">
                  {[
                    ['CPU', 'Apple M2 8-core'],
                    ['RAM', '8 GB'],
                    ['Ổ cứng', '256 GB SSD'],
                    ['Màn hình', '13.6" Liquid Retina'],
                    ['Cổng kết nối', '2x Thunderbolt 3, Jack 3.5mm, MagSafe 3'],
                    ['Hệ điều hành', 'macOS Ventura'],
                    ['Kích thước', '30.41 x 21.5 x 1.13 cm']
                  ].map(([key, value], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? 'bg-[#f8f8f5]/50 dark:bg-[#23220f]/50' : 'bg-white dark:bg-[#1a1a0f]'}>
                      <td className="px-4 py-3 font-medium text-[#8c8b5f]">{key}</td>
                      <td className="px-4 py-3 font-medium text-[#181811] dark:text-white">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full mt-4 py-2 text-sm font-bold text-[#181811] dark:text-white border border-[#e6e6db] dark:border-[#3a3a2a] rounded-full hover:bg-[#f8f8f5] dark:hover:bg-[#2a2a1f] transition-colors">Xem cấu hình đầy đủ</button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-10 border-t border-[#e6e6db] dark:border-[#3a3a2a]" id="reviews">
        <h2 className="text-2xl font-bold text-[#181811] dark:text-white mb-8">Đánh giá & Nhận xét</h2>
        <div className="flex flex-col md:flex-row gap-10">
          {/* Rating Summary Component */}
          <div className="md:w-1/3 min-w-[300px]">
            <div className="bg-white dark:bg-[#1a1a0f] p-6 rounded-2xl border border-[#e6e6db] dark:border-[#3a3a2a] sticky top-24">
              <div className="flex flex-col gap-4">
                <div className="flex items-baseline gap-3">
                  <p className="text-[#181811] dark:text-white text-5xl font-black tracking-tighter">{product.rating}</p>
                  <div className="flex flex-col">
                    <div className="flex text-primary">
                      <span className="material-symbols-outlined fill text-[20px]">star</span>
                      <span className="material-symbols-outlined fill text-[20px]">star</span>
                      <span className="material-symbols-outlined fill text-[20px]">star</span>
                      <span className="material-symbols-outlined fill text-[20px]">star</span>
                      <span className="material-symbols-outlined fill text-[20px] text-[#e6e6db]">star</span>
                    </div>
                    <p className="text-[#8c8b5f] text-sm font-medium">Dựa trên {product.reviews} đánh giá</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {[
                    { stars: 5, pct: '78%' },
                    { stars: 4, pct: '15%' },
                    { stars: 3, pct: '5%' },
                    { stars: 2, pct: '2%' },
                    { stars: 1, pct: '0%' }
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-sm">
                      <span className="w-3 font-bold text-[#181811] dark:text-white">{row.stars}</span>
                      <div className="flex-1 h-2 bg-[#e6e6db] dark:bg-[#3a3a2a] rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: row.pct }}></div>
                      </div>
                      <span className="w-8 text-right text-[#8c8b5f]">{row.pct}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-[#181811] dark:bg-white text-white dark:text-[#181811] font-bold py-3 rounded-full hover:bg-opacity-90 transition-opacity">Viết đánh giá</button>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#1a1a0f] p-6 rounded-2xl border border-[#e6e6db] dark:border-[#3a3a2a]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">MH</div>
                  <div>
                    <p className="font-bold text-[#181811] dark:text-white text-sm">Minh Hoàng</p>
                    <div className="flex text-primary text-[14px]">
                      {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined fill text-[14px]">star</span>)}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-[#8c8b5f]">2 ngày trước</span>
              </div>
              <p className="text-[#181811] dark:text-white text-sm leading-relaxed">
                Máy rất đẹp, mỏng nhẹ đúng như mong đợi. Màu Midnight hơi bám vân tay xíu nhưng dán skin vào là ổn. Pin trâu dùng cả ngày văn phòng không lo sạc. Shop giao hàng nhanh, đóng gói kỹ.
              </p>
              <div className="mt-4 flex gap-2">
                {((product.images && product.images.length > 1) ? product.images[1] : (relatedProducts && relatedProducts[0] && relatedProducts[0].image) || product.image) ? (
                  <div className="size-16 rounded-lg bg-gray-100 overflow-hidden cursor-pointer border border-[#e6e6db] dark:border-[#3a3a2a]">
                    <img className="w-full h-full object-cover" src={(product.images && product.images.length > 1) ? product.images[1] : (relatedProducts && relatedProducts[0] && relatedProducts[0].image) || product.image} alt="Review photo" />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a0f] p-6 rounded-2xl border border-[#e6e6db] dark:border-[#3a3a2a]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">TA</div>
                  <div>
                    <p className="font-bold text-[#181811] dark:text-white text-sm">Tuấn Anh</p>
                    <div className="flex text-primary text-[14px]">
                      {[1, 2, 3, 4].map(s => <span key={s} className="material-symbols-outlined fill text-[14px]">star</span>)}
                      <span className="material-symbols-outlined fill text-[14px] text-[#e6e6db]">star</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-[#8c8b5f]">1 tuần trước</span>
              </div>
              <p className="text-[#181811] dark:text-white text-sm leading-relaxed">
                Hiệu năng M2 quá tốt cho nhu cầu code web của mình. Màn hình đẹp nhưng tai thỏ nhìn chưa quen lắm.
              </p>
            </div>

            <button className="self-center text-sm font-bold text-[#8c8b5f] hover:text-[#181811] dark:hover:text-white mt-2 flex items-center gap-1 transition-colors">
              Xem thêm đánh giá <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-20 mb-10">
        <h2 className="text-2xl font-bold text-[#181811] dark:text-white mb-6">Có thể bạn sẽ thích</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.slice(0, 4).map((item) => (
            <ProductCard key={item.id} product={item} onClick={onProductClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;