import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../constants';

interface AISearchPageProps {
  initialQuery?: string;
}

const AISearchPage: React.FC<AISearchPageProps> = ({ initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || "Laptop học lập trình dưới 20 triệu, pin trâu");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Auto-trigger search if simulated (for demo purposes)
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    } else {
      // Just show results for the demo default state
      setShowResults(true);
    }
  }, []);

  const handleSearch = () => {
    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate API delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center w-full font-display">
      {/* Hero Search Section */}
      <section className="w-full px-4 md:px-10 py-8 md:py-12 bg-white dark:bg-[#1a1a2e] transition-colors">
        <div className="max-w-[960px] mx-auto w-full">
          <div
            className="relative overflow-hidden rounded-2xl md:rounded-[3rem] bg-cover bg-center bg-no-repeat min-h-[400px] md:min-h-[480px] flex flex-col items-center justify-center p-6 gap-8 text-center group transition-all"
            style={{}}
          >
            <div className="flex flex-col gap-4 max-w-2xl z-10">
              <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-lg">
                Trợ lý AI chọn đồ công nghệ
              </h1>
              <p className="text-white/90 text-sm md:text-lg font-medium leading-relaxed max-w-lg mx-auto">
                Nhập nhu cầu của bạn bằng ngôn ngữ tự nhiên. <br className="hidden md:block" />Ví dụ: "Laptop học lập trình dưới 20 triệu, pin trâu"
              </p>
            </div>

            {/* Big Search Bar */}
            <div className="w-full max-w-[600px] z-10">
              <div className="flex w-full items-stretch rounded-full bg-white shadow-xl h-14 md:h-16 transition-transform focus-within:scale-[1.02] duration-300 ring-4 ring-white/20">
                <div className="flex items-center justify-center pl-5 md:pl-6 text-[#8c8b5f]">
                  <span className="material-symbols-outlined">temp_preferences_custom</span>
                </div>
                <input
                  className="flex-1 w-full bg-transparent border-none text-[#181811] placeholder:text-[#8c8b5f]/70 px-4 focus:ring-0 text-base md:text-lg font-medium"
                  placeholder="Mô tả sản phẩm bạn cần tìm..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="p-2">
                  <button
                    onClick={handleSearch}
                    className="h-full px-6 md:px-8 bg-primary rounded-full text-[#181811] text-sm md:text-base font-bold tracking-wide hover:brightness-105 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <span className="material-symbols-outlined text-[20px] font-variation-filled">search_spark</span>
                    <span className="hidden md:inline">Hỏi AI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Status (Transition) */}
      {isAnalyzing && (
        <section className="w-full px-4 md:px-10 py-2">
          <div className="max-w-[960px] mx-auto w-full">
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-[#e6e6db] dark:border-[#3a3a2a] bg-white dark:bg-[#2a291c] shadow-sm animate-pulse">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary animate-spin">sync</span>
                <p className="text-[#181811] dark:text-white text-sm font-bold uppercase tracking-wider">AI đang phân tích yêu cầu...</p>
              </div>
              <div className="w-full h-1.5 bg-[#f8f8f5] dark:bg-[#343323] rounded-full overflow-hidden">
                <div className="h-full bg-[#181811] dark:bg-primary w-[85%] rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {showResults && (
        <section className="w-full px-4 md:px-10 py-6 md:py-10 flex-1 bg-[#f8f8f5] dark:bg-[#101022]">
          <div className="max-w-[960px] mx-auto w-full flex flex-col gap-8">

            {/* AI Findings Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-[#181811] dark:text-white text-2xl md:text-3xl font-bold tracking-tight">Kết quả tìm kiếm</h2>
                <p className="text-[#8c8b5f] text-sm md:text-base">Dựa trên yêu cầu: "{query}"</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm font-bold text-[#181811] dark:text-white hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">tune</span> Bộ lọc nâng cao
                </button>
              </div>
            </div>

            {/* AI Interpretation (Chips) */}
            <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-2xl border border-[#e6e6db] dark:border-[#3a3a2a] shadow-sm flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/20 p-2 text-[#181811] dark:text-white mt-1">
                  <span className="material-symbols-outlined text-[20px] font-variation-filled">lightbulb</span>
                </div>
                <div>
                  <p className="text-[#181811] dark:text-white font-medium mb-2">AI đã hiểu các tiêu chí của bạn:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8f8f5] dark:bg-[#23220f] border border-[#e6e6db] dark:border-[#3a3a2a] text-xs font-bold text-[#181811] dark:text-white">
                      <span className="material-symbols-outlined text-[16px]">code</span> Lập trình
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8f8f5] dark:bg-[#23220f] border border-[#e6e6db] dark:border-[#3a3a2a] text-xs font-bold text-[#181811] dark:text-white">
                      <span className="material-symbols-outlined text-[16px]">payments</span> Dưới 20 Triệu
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8f8f5] dark:bg-[#23220f] border border-[#e6e6db] dark:border-[#3a3a2a] text-xs font-bold text-[#181811] dark:text-white">
                      <span className="material-symbols-outlined text-[16px]">memory</span> RAM &gt;= 16GB
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8f8f5] dark:bg-[#23220f] border border-[#e6e6db] dark:border-[#3a3a2a] text-xs font-bold text-[#181811] dark:text-white">
                      <span className="material-symbols-outlined text-[16px]">speed</span> SSD &gt;= 512GB
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button className="text-xs font-bold text-[#8c8b5f] hover:text-[#181811] dark:hover:text-white transition-colors">Chỉnh sửa tiêu chí</button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Product Card 1 (Best Match) */}
              <div className="group flex flex-col bg-white dark:bg-[#1a1a2e] rounded-2xl border border-primary overflow-hidden shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-primary text-[#181811] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-[14px] font-variation-filled">star</span> 98% Phù hợp nhất
                  </span>
                </div>
                <div className="aspect-[4/3] w-full bg-[#f8f8f5] dark:bg-[#23220f] relative overflow-hidden flex items-center justify-center p-6">
                  <img
                    alt="Dell Inspiron 14 5430"
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFp26BctA6epQ49CvM3VM71_NZvC0oiCbqmoSWfoZO8-NwLHB6JuijUiFEqObulC3-VuEvE-pLZ2p1QZ-N5aC-l70Lc_4xoFbAv-ZefKtM3yMpnLpMNqnX6CUKLzGlsNM63GzWHNO_jRmmr6v5nWTfriMlucWjgsHvRrB2C7gpaYn5kAdzPZWIRsZuR3g38D8IjE3bA-C4IxyvJ_sf80uxD321nsWIx-tmWmxGQEKqle2b38_Zi7uzKyuWpJrr8rw5F8paVeerirYm"
                  />
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-[#181811] dark:text-white leading-tight group-hover:text-primary transition-colors">Dell Inspiron 14 5430</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[#8c8b5f] text-xs font-medium">Core i5-1340P</span>
                      <span className="w-1 h-1 rounded-full bg-[#e6e6db] dark:bg-[#3a3a2a]"></span>
                      <span className="text-[#8c8b5f] text-xs font-medium">16GB RAM</span>
                      <span className="w-1 h-1 rounded-full bg-[#e6e6db] dark:bg-[#3a3a2a]"></span>
                      <span className="text-[#8c8b5f] text-xs font-medium">512GB SSD</span>
                    </div>
                  </div>
                  <div className="bg-[#f8f8f5] dark:bg-[#23220f] rounded-xl p-3 text-xs leading-relaxed border border-[#e6e6db] dark:border-[#3a3a2a]">
                    <p className="text-[#181811] dark:text-white"><span className="font-bold">Lý do chọn:</span> CPU dòng P hiệu năng cao xử lý tốt các IDE nặng. Bàn phím tốt cho coding trong tầm giá.</p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#181811] dark:text-white">{formatCurrency(18990000)}</span>
                    <button className="bg-[#181811] dark:bg-white text-white dark:text-[#181811] rounded-full p-2 hover:bg-opacity-90 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 2 (High Performance) */}
              <div className="group flex flex-col bg-white dark:bg-[#1a1a2e] rounded-2xl border border-[#e6e6db] dark:border-[#3a3a2a] overflow-hidden hover:shadow-lg transition-all duration-300 relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-black/80 dark:bg-white/90 backdrop-blur-sm text-white dark:text-black text-xs font-bold px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">bolt</span> Hiệu năng cao
                  </span>
                </div>
                <div className="aspect-[4/3] w-full bg-[#f8f8f5] dark:bg-[#23220f] relative overflow-hidden flex items-center justify-center p-6">
                  <img
                    alt="Asus Vivobook 15 OLED"
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQxzvo8WOSjPlXpxeaIQIQjIcOatgwGH1dvOd_tIkUBldfO81i17OQhIn0rst_2G0HLHiX3rsaEgaVANnNJ19ZTY578v-AgNCq_wH2a0YX-N5C4vnMFsb_XyShrmbsHjfFAO1acYwKJwwCDTMtrE70x-HtnWZo6cRn6bZKk8TuiFtx5c46XYWEMsx3_h136GjWnpWfA8zgiwFbDjeSqDL5db8WLbGTRdyWHHSyrVJyVN7X9fxIoxatg7QRu_-ygvapY_HNyYK2htbv"
                  />
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-[#181811] dark:text-white leading-tight group-hover:text-primary transition-colors">Asus Vivobook 15 OLED</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[#8c8b5f] text-xs font-medium">Ryzen 7 7730U</span>
                      <span className="w-1 h-1 rounded-full bg-[#e6e6db] dark:bg-[#3a3a2a]"></span>
                      <span className="text-[#8c8b5f] text-xs font-medium">16GB RAM</span>
                    </div>
                  </div>
                  <div className="bg-[#f8f8f5] dark:bg-[#23220f] rounded-xl p-3 text-xs leading-relaxed border border-[#e6e6db] dark:border-[#3a3a2a]">
                    <p className="text-[#181811] dark:text-white"><span className="font-bold">Lý do chọn:</span> Màn hình OLED giúp code lâu đỡ mỏi mắt. Đa nhiệm tốt với 16GB RAM sẵn.</p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#181811] dark:text-white">{formatCurrency(17490000)}</span>
                    <button className="bg-[#f8f8f5] dark:bg-[#23220f] border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white rounded-full p-2 hover:bg-[#e6e6db] dark:hover:bg-[#3a3a2a] transition-colors">
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 3 (Budget Option) */}
              <div className="group flex flex-col bg-white dark:bg-[#1a1a2e] rounded-2xl border border-[#e6e6db] dark:border-[#3a3a2a] overflow-hidden hover:shadow-lg transition-all duration-300 relative">
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-200 text-xs font-bold px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">savings</span> Tiết kiệm
                  </span>
                </div>
                <div className="aspect-[4/3] w-full bg-[#f8f8f5] dark:bg-[#23220f] relative overflow-hidden flex items-center justify-center p-6">
                  <img
                    alt="Lenovo IdeaPad Slim 3"
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoOjWDdsvbdWPIYgyM_9nmxqPRgCJnwLUd365svuIqCyX-o92UPT3ZfprRddLbL7twoyfBILHX30Ydk0Kr1Yfh2Fbdhk6dAi5OpaL7y3SKPZD7M7eJsqpzRjZV-IGrbfeyhx5BOwlIMyIOYl0u6ZvkXUHYzqhNsgcbY2fdrqfAwOQHg54f4G-xFDuoZLJ7x4krGV4dmitNA9MV7Gq8QJ5h5IwaEIFZZbH-ApcEEprF8XyX1jM_3TA1lu2MHxhJcKOTRrTh985SDWCy"
                  />
                </div>
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-[#181811] dark:text-white leading-tight group-hover:text-primary transition-colors">Lenovo IdeaPad Slim 3</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[#8c8b5f] text-xs font-medium">Core i5-12450H</span>
                      <span className="w-1 h-1 rounded-full bg-[#e6e6db] dark:bg-[#3a3a2a]"></span>
                      <span className="text-[#8c8b5f] text-xs font-medium">16GB RAM</span>
                    </div>
                  </div>
                  <div className="bg-[#f8f8f5] dark:bg-[#23220f] rounded-xl p-3 text-xs leading-relaxed border border-[#e6e6db] dark:border-[#3a3a2a]">
                    <p className="text-[#181811] dark:text-white"><span className="font-bold">Lý do chọn:</span> Giá rẻ nhất phân khúc có chip dòng H hiệu năng cao, đủ sức chạy máy ảo.</p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-[#181811] dark:text-white">{formatCurrency(14990000)}</span>
                    <button className="bg-[#f8f8f5] dark:bg-[#23220f] border border-[#e6e6db] dark:border-[#3a3a2a] text-[#181811] dark:text-white rounded-full p-2 hover:bg-[#e6e6db] dark:hover:bg-[#3a3a2a] transition-colors">
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* View More Trigger */}
            <div className="flex justify-center py-6">
              <button className="px-6 py-3 bg-white dark:bg-[#1a1a2e] border border-[#e6e6db] dark:border-[#3a3a2a] rounded-full text-[#181811] dark:text-white font-bold text-sm shadow-sm hover:bg-[#f8f8f5] dark:hover:bg-[#2a291c] transition-colors flex items-center gap-2">
                Xem thêm 12 kết quả khác
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Floating Comparison Button */}
      {showResults && (
        <button className="fixed bottom-6 right-6 z-50 bg-[#181811] dark:bg-primary text-white dark:text-[#181811] px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold hover:scale-105 transition-transform">
          <span className="material-symbols-outlined">compare_arrows</span>
          <span>So sánh (2)</span>
        </button>
      )}
    </div>
  );
};

export default AISearchPage;