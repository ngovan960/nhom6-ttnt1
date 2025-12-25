import React, { useState } from 'react';
import { useAuthStore } from "../../store/useAuthStore";

interface AdminLoginPageProps {
    onLoginSuccess: () => void;
    onBackToHome: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const user = await login(email, password);
            // login in authStore returns the user object usually, or we can check store after
            if (user && user.role === 'admin') {
                onLoginSuccess();
            } else {
                // If logged in but not admin, we might want to logout or just show error
                setError('Tài khoản này không có quyền quản trị.');
                // Optional: useAuthStore.getState().logout(); 
            }
        } catch (err: any) {
            setError(err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-display">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-[440px] relative z-10">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                            <span className="material-symbols-outlined text-white text-[32px]">admin_panel_settings</span>
                        </div>
                        <h1 className="text-white text-2xl font-bold tracking-tight">Admin Portal</h1>
                        <p className="text-slate-400 text-sm mt-2 text-center">Đăng nhập bằng tài khoản quản trị để tiếp tục</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 animate-shake">
                                <span className="material-symbols-outlined text-[18px]">error</span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium">Email quản trị</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[20px]">mail</span>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@techstore.com"
                                    className="w-full h-12 bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium">Mật khẩu</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined text-[20px]">lock</span>
                                <input
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-12 bg-slate-800/50 border border-slate-700 rounded-xl pl-11 pr-12 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility' : 'visibility_off'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Xác nhận danh tính</span>
                                    <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                        <button
                            onClick={onBackToHome}
                            className="text-slate-500 hover:text-slate-300 text-sm flex items-center justify-center gap-1 mx-auto transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Quay về trang khách hàng
                        </button>
                    </div>
                </div>

                <p className="text-slate-600 text-[11px] text-center mt-6 uppercase tracking-widest font-bold">
                    &copy; 2024 TechStore Admin Control Panel
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
