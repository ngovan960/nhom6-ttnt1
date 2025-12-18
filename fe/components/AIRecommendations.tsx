import React from 'react';
import { RECOMMENDATIONS, formatCurrency } from '../constants';

const AIRecommendations: React.FC = () => {
  return (
    <div className="w-full rounded-[2rem] bg-gradient-to-r from-[#e0e7ff] to-[#f3e8ff] dark:from-[#1e1b4b] dark:to-[#3b0764] p-8 mb-12 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[300px] text-[#4f46e5] dark:text-[#a855f7]">auto_awesome</span>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#4f46e5] dark:text-[#a855f7]">auto_awesome</span>
            <span className="text-sm font-bold uppercase tracking-widest text-[#4f46e5] dark:text-[#a855f7]">Gợi ý từ AI</span>
          </div>
          <h2 className="text-3xl font-black text-[#181811] dark:text-white mb-2">Dành riêng cho bạn</h2>
          <p className="text-[#5e5d4a] dark:text-[#bebdb0] max-w-md">
            Dựa trên xu hướng tìm kiếm và các sản phẩm bạn đã xem gần đây.
          </p>
        </div>
        <button className="bg-white dark:bg-black/50 text-[#181811] dark:text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-primary hover:text-black transition-colors">
          Làm mới gợi ý
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {RECOMMENDATIONS.map((item) => (
          <div 
            key={item.id}
            className="bg-white/60 dark:bg-black/20 backdrop-blur-sm p-4 rounded-xl flex gap-4 items-center hover:bg-white dark:hover:bg-black/40 transition-colors cursor-pointer group"
          >
            <div className="size-20 rounded-lg bg-white shrink-0 overflow-hidden">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                alt={item.name} 
                src={item.image} 
              />
            </div>
            <div>
              <h4 className="font-bold text-[#181811] dark:text-white text-sm">{item.name}</h4>
              <p className="text-xs text-[#5e5d4a] dark:text-[#bebdb0] mt-1">{item.description}</p>
              <p className="text-primary dark:text-primary font-bold text-sm mt-2">{formatCurrency(item.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;