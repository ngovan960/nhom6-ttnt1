import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface ResetPasswordPageProps {
    token?: string | null;
    onBack?: () => void;
    onSuccess?: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token, onBack, onSuccess }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState<string | null>(token ?? null);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const [tokenMessage, setTokenMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!resetToken) {
            const m = window.location.pathname.match(/^\/reset-password\/([^/]+)/);
            if (m) setResetToken(m[1]);
        }
    }, [resetToken]);

    useEffect(() => {
        const verify = async () => {
            if (!resetToken) return;
            try {
                setTokenValid(null);
                const res = await authService.verifyResetToken(resetToken);
                // if backend returns { valid: true } or similar
                if ((res as any).valid === false) {
                    setTokenValid(false);
                    setTokenMessage('Token không hợp lệ hoặc đã hết hạn');
                } else {
                    setTokenValid(true);
                    setTokenMessage(null);
                }
            } catch (err: any) {
                setTokenValid(false);
                const message = err?.message || err?.error || JSON.stringify(err);
                setTokenMessage(message || 'Token không hợp lệ hoặc đã hết hạn');
            }
        };
        verify();
    }, [resetToken]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resetToken) {
            alert('Token không hợp lệ.');
            return;
        }
        if (tokenValid === false) {
            alert(tokenMessage || 'Token không hợp lệ hoặc đã hết hạn');
            return;
        }
        if (!newPassword) {
            alert('Vui lòng nhập mật khẩu mới.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        try {
            const res = await authService.resetPassword({ token: resetToken, password: newPassword });
            alert((res as any)?.message || 'Đặt lại mật khẩu thành công.');
            if (onSuccess) onSuccess();
        } catch (err: any) {
            const message = err?.message || err?.error || JSON.stringify(err);
            alert(message || 'Đặt lại mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
            <div className="w-full max-w-md bg-white dark:bg-[#1a1a2e] rounded-xl shadow p-8">
                <h2 className="text-2xl font-bold mb-4 text-[#111118] dark:text-white">Đặt lại mật khẩu</h2>
                <p className="text-sm text-[#60608a] dark:text-slate-400 mb-6">Nhập mật khẩu mới của bạn.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#111118] dark:text-slate-200 mb-1">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-11 px-3 rounded border border-[#e5e5e5] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#111118] dark:text-white"
                            placeholder="Mật khẩu mới"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#111118] dark:text-slate-200 mb-1">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-11 px-3 rounded border border-[#e5e5e5] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#111118] dark:text-white"
                            placeholder="Xác nhận mật khẩu"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex-1 h-11 rounded bg-gray-100 dark:bg-slate-800 text-sm"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 h-11 rounded bg-[#0d0df2] text-white text-sm ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
