import React, { useState } from 'react';
import { formatCurrency } from '../constants';

const AIComparisonPage: React.FC = () => {
  const [showDiffOnly, setShowDiffOnly] = useState(true);

  return (
    <div className="w-full font-space text-[#100d1c] dark:text-white bg-[#f9f8fc] dark:bg-[#131022] min-h-screen transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">

        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <a className="hover:text-[#330df2] transition-colors" href="#">Trang chủ</a>
          <span className="mx-2">/</span>
          <a className="hover:text-[#330df2] transition-colors" href="#">Laptop</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">So sánh sản phẩm</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">So sánh chi tiết</h2>
            <div className="flex items-center gap-2 text-[#330df2] text-sm font-medium bg-[#330df2]/5 w-fit px-3 py-1 rounded-full border border-[#330df2]/10">
              <span className="material-symbols-outlined text-lg animate-pulse">auto_awesome</span>
              <span>Được hỗ trợ bởi AI Analysis - Cập nhật 10 phút trước</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-bold transition-colors bg-white dark:bg-[#1e1b2e] shadow-sm text-gray-900 dark:text-white">
              <span className="material-symbols-outlined text-lg">share</span>
              Chia sẻ
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#330df2] hover:bg-[#2309a8] text-white text-sm font-bold shadow-lg shadow-[#330df2]/30 transition-all transform hover:-translate-y-0.5">
              <span className="material-symbols-outlined text-lg">add</span>
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* AI Insight Section (Hero) */}
        <section className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f0f4ff] to-[#fdfbf7] dark:from-[#1a1633] dark:to-[#1e1b2e] border border-[#330df2]/10 shadow-[0_4px_20px_-2px_rgba(51,13,242,0.08)]">
          <div className="absolute top-0 right-0 p-32 bg-[#330df2]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* AI Verdict Summary */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gradient-to-r from-[#330df2] to-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">AI Verdict</span>
                  <span className="text-gray-500 text-sm">Dựa trên nhu cầu 'Văn phòng & Đồ họa nhẹ'</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  <span className="text-[#330df2]">MacBook Air M2</span> là lựa chọn tối ưu nhất cho bạn.
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                  Mặc dù Dell XPS 13 có giá tốt hơn, MacBook Air M2 vượt trội hoàn toàn về thời lượng pin (hơn 4 tiếng) và độ chuẩn màu màn hình - yếu tố quan trọng cho công việc thiết kế của bạn. Hiệu năng render video nhẹ cũng nhanh hơn 15% nhờ Media Engine.
                </p>
                {/* Key Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-[#1e1b2e]/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-[#330df2]">
                      <span className="material-symbols-outlined">bolt</span>
                      <span className="font-bold text-sm">Hiệu năng</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Apple M2 xử lý tác vụ đơn nhân nhanh hơn 18%.</p>
                  </div>
                  <div className="bg-white dark:bg-[#1e1b2e]/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-green-600">
                      <span className="material-symbols-outlined">battery_charging_full</span>
                      <span className="font-bold text-sm">Pin & Sạc</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">MacBook trụ được 14h, Dell XPS chỉ đạt 9h.</p>
                  </div>
                  <div className="bg-white dark:bg-[#1e1b2e]/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-orange-500">
                      <span className="material-symbols-outlined">savings</span>
                      <span className="font-bold text-sm">Giá trị</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dell XPS tiết kiệm được 3.5 triệu đồng.</p>
                  </div>
                </div>
              </div>
              {/* AI Chat / Suggestions */}
              <div className="w-full md:w-80 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-white/10 flex flex-col gap-3">
                <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#330df2] text-lg">chat_spark</span>
                  Hỏi thêm AI về so sánh này
                </div>
                <button className="text-left w-full text-xs text-gray-600 hover:text-[#330df2] bg-white dark:bg-[#1e1b2e] p-3 rounded-lg border border-gray-200 hover:border-[#330df2] transition-colors dark:border-gray-700 dark:text-gray-300">
                  "Máy nào bền hơn cho việc di chuyển nhiều?"
                </button>
                <button className="text-left w-full text-xs text-gray-600 hover:text-[#330df2] bg-white dark:bg-[#1e1b2e] p-3 rounded-lg border border-gray-200 hover:border-[#330df2] transition-colors dark:border-gray-700 dark:text-gray-300">
                  "So sánh khả năng nâng cấp về sau?"
                </button>
                <div className="relative">
                  <input className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-2 text-sm focus:outline-none focus:border-[#330df2] placeholder-gray-400 text-gray-900 dark:text-white" placeholder="Gõ câu hỏi của bạn..." type="text" />
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[#330df2]">
                    <span className="material-symbols-outlined text-lg">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Comparison Grid */}
        <div className="relative">
          {/* Sticky Header for Comparison Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 sticky top-[72px] bg-[#f9f8fc] dark:bg-[#131022] z-30 py-4 border-b border-gray-200 dark:border-gray-800 transition-colors">
            {/* Column 1 Header: Legend/Controls */}
            <div className="hidden md:flex flex-col justify-end pb-4">
              <div className="flex items-center gap-2 mb-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showDiffOnly}
                    onChange={() => setShowDiffOnly(!showDiffOnly)}
                  />
                  <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#330df2]"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Chỉ hiện khác biệt</span>
                </label>
              </div>
            </div>
            {/* Product 1 */}
            <div className="flex flex-col gap-3 group relative">
              <div className="absolute -top-2 -right-2 z-10">
                <button className="bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded-full p-1 transition-colors">
                  <span className="material-symbols-outlined text-sm block">close</span>
                </button>
              </div>
              <div className="bg-white dark:bg-[#1e1b2e] rounded-xl p-4 flex items-center justify-center h-48 border border-gray-100 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-shadow">
                <img className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" src="" alt="MacBook Air M2" />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">AI PICK</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">MacBook Air M2 13" 2022</h3>
                <p className="text-xl font-bold text-[#330df2]">{formatCurrency(26990000)}</p>
              </div>
              <button className="w-full py-2 bg-[#330df2] hover:bg-[#2309a8] text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-[#330df2]/20">Mua ngay</button>
            </div>
            {/* Product 2 */}
            <div className="flex flex-col gap-3 group relative">
              <div className="absolute -top-2 -right-2 z-10">
                <button className="bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded-full p-1 transition-colors">
                  <span className="material-symbols-outlined text-sm block">close</span>
                </button>
              </div>
              <div className="bg-white dark:bg-[#1e1b2e] rounded-xl p-4 flex items-center justify-center h-48 border border-gray-100 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-shadow">
                <img className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" src="" alt="Dell XPS 13" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">Dell XPS 13 Plus 9320</h3>
                <p className="text-xl font-bold text-[#330df2]">{formatCurrency(23490000)}</p>
              </div>
              <button className="w-full py-2 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 hover:border-[#330df2] hover:text-[#330df2] text-gray-900 dark:text-white rounded-lg text-sm font-bold transition-colors">Mua ngay</button>
            </div>
            {/* Add Slot */}
            <div className="hidden md:flex flex-col gap-3 justify-end pb-[52px]">
              <button className="group h-full max-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-[#330df2] hover:bg-[#330df2]/5 transition-all cursor-pointer">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full group-hover:bg-[#330df2] group-hover:text-white transition-colors text-gray-400">
                  <span className="material-symbols-outlined text-2xl">add</span>
                </div>
                <span className="text-sm font-bold text-gray-500 group-hover:text-[#330df2]">Thêm sản phẩm</span>
              </button>
            </div>
          </div>

          {/* Specs Table */}
          <div className="flex flex-col gap-8">
            {/* Spec Category: General */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2">Tổng quan & Thiết kế</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-[#1e1b2e] rounded-lg transition-colors px-2">
                <div className="text-sm text-gray-500 font-medium md:col-span-1 flex items-center">Màn hình</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">13.6" Liquid Retina, 500 nits, P3 Color</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">13.4" FHD+ InfinityEdge, 500 nits, sRGB</div>
                <div className="hidden md:block"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-[#1e1b2e] rounded-lg transition-colors px-2">
                <div className="text-sm text-gray-500 font-medium md:col-span-1 flex items-center">Trọng lượng</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">1.24 kg <span className="text-green-500 text-xs ml-1">(Nhẹ hơn)</span></div>
                <div className="text-sm text-gray-600 dark:text-gray-300">1.26 kg</div>
                <div className="hidden md:block"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-[#1e1b2e] rounded-lg transition-colors px-2 bg-[#330df2]/5 rounded">
                <div className="text-sm text-[#330df2] font-bold md:col-span-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">palette</span> Màu sắc
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Midnight, Starlight, Space Grey, Silver</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Platinum, Graphite</div>
                <div className="hidden md:block"></div>
              </div>
            </div>
            {/* Spec Category: Performance */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2">Hiệu năng</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-[#1e1b2e] rounded-lg transition-colors px-2">
                <div className="text-sm text-gray-500 font-medium md:col-span-1 flex items-center">CPU</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Apple M2 (8-core CPU)</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Intel Core i7-1260P (12-core)</div>
                <div className="hidden md:block"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-[#1e1b2e] rounded-lg transition-colors px-2">
                <div className="text-sm text-gray-500 font-medium md:col-span-1 flex items-center">RAM</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">8GB Unified Memory</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">16GB LPDDR5 <span className="text-green-500 text-xs ml-1">(Gấp đôi)</span></div>
                <div className="hidden md:block"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-[#1e1b2e] rounded-lg transition-colors px-2 bg-green-50 dark:bg-green-900/10 rounded">
                <div className="text-sm text-green-700 dark:text-green-400 font-bold md:col-span-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">battery_horiz_075</span> Pin thực tế (Web)
                </div>
                <div className="text-sm font-bold text-green-700 dark:text-green-400">~14 giờ 30 phút</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">~9 giờ 15 phút</div>
                <div className="hidden md:block"></div>
              </div>
            </div>
            {/* Spec Category: Ports */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2">Kết nối</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 items-start py-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-white dark:hover:bg-[#1e1b2e] rounded-lg transition-colors px-2">
                <div className="text-sm text-gray-500 font-medium md:col-span-1 flex items-center">Cổng kết nối</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">2x Thunderbolt / USB 4, MagSafe 3, 3.5mm Jack</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">2x Thunderbolt 4 (USB Type-C)</div>
                <div className="hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Carousel */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#330df2]">psychology</span>
              Gợi ý thay thế thông minh
            </h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-500">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-500">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Rec Card 1 */}
            <div className="group bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-all hover:-translate-y-1 relative">
              <div className="absolute top-3 left-3 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">RẺ HƠN 20%</div>
              <div className="h-40 flex items-center justify-center mb-4">
                <img className="max-h-full max-w-full object-contain" src="" alt="MacBook Air M1" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">MacBook Air M1 2020</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">Hiệu năng vẫn rất tốt cho văn phòng, giá mềm hơn đáng kể.</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#330df2]">{formatCurrency(18990000)}</span>
                <button className="text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-[#330df2] hover:text-white px-3 py-1.5 rounded transition-colors">So sánh</button>
              </div>
            </div>
            {/* Rec Card 2 */}
            <div className="group bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-all hover:-translate-y-1 relative">
              <div className="absolute top-3 left-3 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded">HIỆU NĂNG CAO</div>
              <div className="h-40 flex items-center justify-center mb-4">
                <img className="max-h-full max-w-full object-contain" src="" alt="MacBook Pro" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">MacBook Pro 13" M2</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">Có quạt tản nhiệt, phù hợp nếu bạn render video nặng liên tục.</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#330df2]">{formatCurrency(29990000)}</span>
                <button className="text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-[#330df2] hover:text-white px-3 py-1.5 rounded transition-colors">So sánh</button>
              </div>
            </div>
            {/* Rec Card 3 */}
            <div className="group bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-all hover:-translate-y-1 relative">
              <div className="h-40 flex items-center justify-center mb-4">
                <img className="max-h-full max-w-full object-contain" src="" alt="Surface Laptop" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">Surface Laptop 5 13.5"</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">Màn hình cảm ứng, thiết kế sang trọng, chạy Windows mượt mà.</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#330df2]">{formatCurrency(24590000)}</span>
                <button className="text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-[#330df2] hover:text-white px-3 py-1.5 rounded transition-colors">So sánh</button>
              </div>
            </div>
            {/* Rec Card 4 */}
            <div className="group bg-white dark:bg-[#1e1b2e] rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-all hover:-translate-y-1 relative">
              <div className="h-40 flex items-center justify-center mb-4">
                <img className="max-h-full max-w-full object-contain" src="" alt="LG Gram" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">LG Gram 14 2023</h3>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">Siêu nhẹ chỉ 999g, bền bỉ chuẩn quân đội, pin trâu.</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#330df2]">{formatCurrency(27490000)}</span>
                <button className="text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-[#330df2] hover:text-white px-3 py-1.5 rounded transition-colors">So sánh</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AIComparisonPage;