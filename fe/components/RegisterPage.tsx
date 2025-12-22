import React, { useState } from 'react';
import { authService } from '../services/auth.service';

interface RegisterPageProps {
  onBack: () => void;
  onLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onBack, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullname.trim() || !email.trim() || !password) {
      alert('Vui lòng điền đầy đủ họ tên, email và mật khẩu.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({ fullname, email, password, phone });

      // res follows: { message: string, data: { id, email, fullname, ... } }
      alert(res.message || 'Đăng ký thành công. Vui lòng đăng nhập.');
      console.log('Registered user:', res.data);
      onLogin();
    } catch (err: any) {
      const message = err?.message || err?.error || JSON.stringify(err);
      alert(message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f8] dark:bg-[#101022] font-display text-slate-900 dark:text-white transition-colors duration-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1a2e] px-6 lg:px-10 py-3 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onBack(); }}
              className="flex items-center gap-2 text-slate-900 dark:text-white group"
            >
              <div className="size-8 flex items-center justify-center rounded-lg bg-[#0d0df2]/10 text-[#0d0df2] group-hover:bg-[#0d0df2] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">TechZone</h2>
            </a>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <a href="#" className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-[#0d0df2] transition-colors hidden sm:block">Trợ giúp</a>
            <button
              onClick={onLogin}
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-[#0d0df2]/10 hover:bg-[#0d0df2]/20 text-[#0d0df2] dark:text-blue-400 text-sm font-bold transition-all"
            >
              <span className="truncate">Đăng nhập</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Left Column: Form */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  {/* Headline */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Tạo tài khoản mới</h1>
                    <p className="text-slate-500 dark:text-slate-400">Tham gia cộng đồng công nghệ hàng đầu để nhận ưu đãi độc quyền.</p>
                  </div>

                  {/* Social Login */}
                  {/* <div className="grid grid-cols-2 gap-4 mb-6">
                    <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm text-slate-700 dark:text-slate-200">
                      <span className="w-5 h-5 inline-block" />
                      Google
                    </button>
                    <button className="flex items-center justify-center gap-2 h-12 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm text-slate-700 dark:text-slate-200">
                      <span className="w-5 h-5 inline-block" />
                      Facebook
                    </button>
                  </div> */}

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    {/* <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-[#1a1a2e] text-slate-500">Hoặc đăng ký bằng email</span>
                    </div> */}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Họ và tên</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full h-12 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d0df2] focus:ring-[#0d0df2] dark:focus:ring-[#0d0df2]/50 text-base px-4 transition-all outline-none border"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="vidu@email.com"
                          className="w-full h-12 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d0df2] focus:ring-[#0d0df2] dark:focus:ring-[#0d0df2]/50 text-base px-4 transition-all outline-none border"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Số điện thoại</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0123456789"
                          className="w-full h-12 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d0df2] focus:ring-[#0d0df2] dark:focus:ring-[#0d0df2]/50 text-base px-4 transition-all outline-none border"
                        />
                      </div>
                    </div>

                    {/* Password Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mật khẩu</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-12 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d0df2] focus:ring-[#0d0df2] dark:focus:ring-[#0d0df2]/50 text-base px-4 pr-10 transition-all outline-none border"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none"
                          >
                            <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Xác nhận mật khẩu</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-12 rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#0d0df2] focus:ring-[#0d0df2] dark:focus:ring-[#0d0df2]/50 text-base px-4 pr-10 transition-all outline-none border"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none"
                          >
                            <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                      <div className="flex h-6 items-center">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-slate-300 text-[#0d0df2] focus:ring-[#0d0df2] dark:border-slate-600 dark:bg-slate-800 dark:ring-offset-slate-900"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <p className="text-slate-600 dark:text-slate-400">Tôi đồng ý với <a href="#" className="font-semibold text-[#0d0df2] hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="font-semibold text-[#0d0df2] hover:underline">Chính sách bảo mật</a>.</p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex items-center justify-center h-12 rounded-lg bg-[#0d0df2] ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'} text-white font-bold text-base transition-colors shadow-lg shadow-[#0d0df2]/30 mt-2`}
                    >
                      {loading ? 'Đang gửi...' : 'Đăng ký ngay'}
                    </button>
                  </form>

                  {/* Footer Link */}
                  <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Đã có tài khoản?
                    <button onClick={onLogin} className="font-bold text-[#0d0df2] hover:underline ml-1">Đăng nhập</button>
                  </p>
                </div>
              </div>

              {/* Right Column: Marketing Image */}
              <div className="relative hidden lg:block bg-slate-100 dark:bg-slate-800">
                <img
                  alt="Modern workspace"
                  className="absolute inset-0 h-full w-full object-cover"
                  src=""
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0df2]/90 to-[#0d0df2]/20 mix-blend-multiply opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 p-12 text-white">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Uy tín số 1
                  </div>
                  <h3 className="text-3xl font-bold mb-3 leading-tight">Trải nghiệm mua sắm <br />công nghệ đỉnh cao</h3>
                  <p className="text-white/80 text-lg max-w-sm">Tìm kiếm sản phẩm thông minh, so sánh cấu hình và nhận ưu đãi dành riêng cho sinh viên.</p>

                  {/* Small trust indicators */}
                  <div className="flex items-center gap-6 mt-8">
                    <div className="flex -space-x-3">
                      <img alt="User 1" className="inline-block h-8 w-8 rounded-full ring-2 ring-white/20 object-cover" src="" />
                      <img alt="User 2" className="inline-block h-8 w-8 rounded-full ring-2 ring-white/20 object-cover" src="" />
                      <img alt="User 3" className="inline-block h-8 w-8 rounded-full ring-2 ring-white/20 object-cover" src="" />
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20 backdrop-blur-sm text-[10px] font-bold">+2k</div>
                    </div>
                    <div className="text-sm font-medium text-white/90">Thành viên mới tuần này</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegisterPage;