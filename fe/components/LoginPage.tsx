import React, { useState } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import { authService } from "../services/auth.service";

interface LoginPageProps {
  onBack: () => void;
  onRegister: () => void;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onRegister, onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'forgot-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, loading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      const message = err?.message || err?.error || JSON.stringify(err);
      alert(message || 'Đăng nhập thất bại');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      alert('Vui lòng nhập email.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authService.forgotPassword({ email: forgotEmail });
      alert(res.message || 'Đã gửi hướng dẫn đặt lại mật khẩu.');
      setView('login');
    } catch (err: any) {
      const message = err?.message || err?.error || JSON.stringify(err);
      alert(message || 'Gửi hướng dẫn thất bại');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f8] dark:bg-[#101022] font-display text-[#111118] dark:text-white antialiased overflow-x-hidden min-h-screen flex flex-col transition-colors duration-200">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#0d0df2]/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 lg:px-10 border-b border-[#f0f0f5] dark:border-slate-800 bg-white/80 dark:bg-[#101022]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="flex items-center gap-3 group">
            <div className="w-8 h-8 flex items-center justify-center bg-[#0d0df2] text-white rounded-lg shadow-[0_0_20px_-5px_rgba(13,13,242,0.3)] group-hover:shadow-[0_4px_20px_-2px_rgba(13,13,242,0.3)] transition-all duration-300">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <h2 className="text-[#111118] dark:text-white text-xl font-bold tracking-tight">TechStore</h2>
          </a>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#60608a] dark:text-slate-400 text-sm font-medium hover:text-[#0d0df2] transition-colors hidden sm:block">Trợ giúp</a>
            <button
              onClick={onBack}
              className="text-[#111118] dark:text-white text-sm font-medium hover:text-[#0d0df2] transition-colors"
            >
              <span className="hidden sm:inline">Quay lại </span>Trang chủ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[480px]">

          {view === 'login' ? (
            /* Login Card */
            <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 transition-all">
              {/* Heading */}
              <div className="mb-8">
                <h1 className="text-[#111118] dark:text-white text-3xl font-bold leading-tight mb-2 tracking-tight">Chào mừng trở lại</h1>
                <p className="text-[#60608a] dark:text-slate-400 text-sm font-normal">Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email Input */}
                <label className="flex flex-col w-full">
                  <p className="text-[#111118] dark:text-slate-200 text-sm font-medium leading-normal pb-2">Email hoặc số điện thoại</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="flex w-full rounded-lg text-[#111118] dark:text-white border border-[#dbdbe6] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0d0df2] focus:ring-1 focus:ring-[#0d0df2] h-12 placeholder:text-[#60608a] dark:placeholder:text-slate-500 px-4 text-base font-normal transition-all outline-none"
                  />
                </label>

                {/* Password Input */}
                <label className="flex flex-col w-full">
                  <div className="flex justify-between items-center pb-2">
                    <p className="text-[#111118] dark:text-slate-200 text-sm font-medium leading-normal">Mật khẩu</p>
                  </div>
                  <div className="relative flex w-full items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="flex w-full rounded-lg text-[#111118] dark:text-white border border-[#dbdbe6] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0d0df2] focus:ring-1 focus:ring-[#0d0df2] h-12 placeholder:text-[#60608a] dark:placeholder:text-slate-500 pl-4 pr-12 text-base font-normal transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#60608a] dark:text-slate-400 hover:text-[#111118] dark:hover:text-white transition-colors flex items-center justify-center outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </label>

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-[#0d0df2] border-[#dbdbe6] dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-[#0d0df2]/20 size-4"
                    />
                    <span className="text-sm text-[#60608a] dark:text-slate-400">Ghi nhớ tôi</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-sm font-medium text-[#0d0df2] hover:text-blue-700 underline decoration-transparent hover:decoration-current transition-all"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-12 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'} bg-[#0d0df2] text-white font-medium rounded-lg shadow-lg shadow-[#0d0df2]/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-2`}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#dbdbe6] dark:border-slate-700"></div>
                  <span className="flex-shrink-0 mx-4 text-[#60608a] dark:text-slate-500 text-xs font-medium uppercase tracking-wider">Hoặc đăng nhập với</span>
                  <div className="flex-grow border-t border-[#dbdbe6] dark:border-slate-700"></div>
                </div>

                {/* Social Buttons */}
                {/* <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#dbdbe6] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" data-alt="Biểu tượng Google">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    <span className="text-sm font-medium text-[#111118] dark:text-white">Google</span>
                  </button>
                  <button type="button" className="flex h-12 items-center justify-center gap-2 rounded-lg border border-[#dbdbe6] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <svg className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" data-alt="Biểu tượng Facebook">
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 2.898v1.072h4.508l-.543 3.667h-3.965v7.98c0 .033-.001.065-.001.099a9.967 9.967 0 0 1-5.015 0c0-.034-.001-.066-.001-.099z"></path>
                    </svg>
                    <span className="text-sm font-medium text-[#111118] dark:text-white">Facebook</span>
                  </button>
                </div> */}
              </form>

              {/* Footer of Card */}
              <div className="mt-8 text-center">
                <p className="text-sm text-[#60608a] dark:text-slate-400">
                  Bạn chưa có tài khoản?
                  <button onClick={onRegister} className="font-semibold text-[#0d0df2] hover:text-blue-700 transition-colors ml-1">Đăng ký ngay</button>
                </p>
              </div>
            </div>
          ) : (
            /* Forgot Password Card */
            <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 sm:p-10 transition-all">
              <div className="mb-8">
                <div className="w-12 h-12 bg-[#0d0df2]/10 rounded-full flex items-center justify-center mb-6 text-[#0d0df2]">
                  <span className="material-symbols-outlined text-[24px]">lock_reset</span>
                </div>
                <h1 className="text-[#111118] dark:text-white text-3xl font-bold leading-tight mb-3 tracking-tight">Quên mật khẩu?</h1>
                <p className="text-[#60608a] dark:text-slate-400 text-sm font-normal leading-relaxed">Đừng lo lắng! Nhập địa chỉ email hoặc tên người dùng đã đăng ký của bạn, chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.</p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-6">
                <label className="flex flex-col w-full">
                  <p className="text-[#111118] dark:text-slate-200 text-sm font-medium leading-normal pb-2">Email</p>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#60608a] dark:text-slate-500">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </span>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="flex w-full rounded-lg text-[#111118] dark:text-white border border-[#dbdbe6] dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-[#0d0df2] focus:ring-1 focus:ring-[#0d0df2] h-12 placeholder:text-[#60608a] dark:placeholder:text-slate-500 pl-12 pr-4 text-base font-normal transition-all outline-none"
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className={`w-full h-12 bg-[#0d0df2] ${forgotLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'} text-white font-medium rounded-lg shadow-lg shadow-[#0d0df2]/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-2`}
                >
                  {forgotLoading ? 'Đang gửi...' : 'Gửi hướng dẫn'}
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>

              <div className="mt-8 text-center pt-2 border-t border-[#f0f0f5] dark:border-slate-800">
                <p className="text-sm text-[#60608a] dark:text-slate-400">
                  Bạn đã nhớ mật khẩu?
                  <button
                    onClick={() => setView('login')}
                    className="font-semibold text-[#0d0df2] hover:text-blue-700 transition-colors inline-flex items-center gap-1 ml-1"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Footer Links (Privacy/Terms) */}
          <div className="mt-8 flex justify-center gap-6">
            <a href="#" className="text-xs text-[#60608a] dark:text-slate-500 hover:text-[#0d0df2] transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="text-xs text-[#60608a] dark:text-slate-500 hover:text-[#0d0df2] transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-xs text-[#60608a] dark:text-slate-500 hover:text-[#0d0df2] transition-colors">Trợ giúp</a>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-[#60608a]/60 dark:text-slate-600">© 2024 TechStore. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;