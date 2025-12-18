import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#1f1e0d] border-t border-[#e5e5e0] dark:border-[#3a392a] pt-12 pb-8 px-4 md:px-10 lg:px-40 transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#181811] dark:text-white">
              <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-[#181811]">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <h2 className="text-lg font-bold">TechZone</h2>
            </div>
            <p className="text-[#5e5d4a] dark:text-[#bebdb0] text-sm leading-relaxed">
              Hệ thống bán lẻ thiết bị công nghệ chính hãng hàng đầu. Cam kết chất lượng, bảo hành uy tín.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#181811] dark:text-white mb-4">Sản phẩm</h3>
            <ul className="flex flex-col gap-2 text-sm text-[#5e5d4a] dark:text-[#bebdb0]">
              <li><a className="hover:text-primary transition-colors" href="#">Laptop</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Điện thoại</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Tablet</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Phụ kiện</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#181811] dark:text-white mb-4">Hỗ trợ</h3>
            <ul className="flex flex-col gap-2 text-sm text-[#5e5d4a] dark:text-[#bebdb0]">
              <li><a className="hover:text-primary transition-colors" href="#">Tra cứu bảo hành</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Hướng dẫn mua hàng</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Chính sách đổi trả</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-[#181811] dark:text-white mb-4">Đăng ký nhận tin</h3>
            <div className="flex flex-col gap-3">
              <input 
                className="bg-[#f5f5f0] dark:bg-[#343323] border-none rounded-xl px-4 py-2 text-sm text-[#181811] dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                placeholder="Email của bạn" 
                type="email" 
              />
              <button className="bg-primary text-[#181811] font-bold py-2 rounded-xl hover:brightness-105 transition-all active:scale-95">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-[#f5f5f0] dark:border-[#2a291c] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#8c8b5f] dark:text-[#707060]">© 2024 TechZone. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[#8c8b5f] cursor-pointer hover:text-primary transition-colors">social_leaderboard</span>
            <span className="material-symbols-outlined text-[#8c8b5f] cursor-pointer hover:text-primary transition-colors">smart_display</span>
            <span className="material-symbols-outlined text-[#8c8b5f] cursor-pointer hover:text-primary transition-colors">photo_camera</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;