import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="@container mb-10">
      <div className="flex flex-col gap-6 md:gap-8 lg:flex-row items-center bg-white dark:bg-[#2a291c] p-6 rounded-[2rem] shadow-sm transition-colors duration-200">
        <div
          className="w-full lg:w-1/2 aspect-video rounded-[1.5rem] bg-cover bg-center overflow-hidden relative shadow-inner"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
            <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">Featured</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full lg:w-1/2 lg:pl-6 text-left">
          <div className="flex flex-col gap-3">
            <div className="inline-flex self-start items-center gap-1 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary dark:text-[#f9f506]">
              <span className="material-symbols-outlined text-sm">school</span>
              <span className="text-black">Back to School</span>
            </div>
            <h1 className="text-[#181811] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Công nghệ đỉnh cao<br />cho tương lai
            </h1>
            <p className="text-[#5e5d4a] dark:text-[#bebdb0] text-lg leading-relaxed">
              Giảm tới <span className="font-bold text-[#181811] dark:text-white">30%</span> cho Laptop và Tablet. Sẵn sàng cho năm học mới với các deal hời nhất.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center justify-center rounded-full h-12 px-8 bg-primary text-[#181811] text-base font-bold hover:brightness-105 transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-[2px]">
              Mua ngay
            </button>
            <button className="flex items-center justify-center rounded-full h-12 px-8 bg-[#f5f5f0] dark:bg-[#343323] text-[#181811] dark:text-white text-base font-bold hover:bg-[#e8e8e0] dark:hover:bg-[#454433] transition-colors">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;