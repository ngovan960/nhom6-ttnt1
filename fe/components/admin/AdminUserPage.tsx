import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axiosClient from '../../lib/axios';

interface User {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    avatar?: string;
}

interface AdminUserPageProps {
    onNavigate: (page: 'dashboard' | 'products' | 'orders' | 'coupons' | 'customers' | 'home') => void;
}

const AdminUserPage: React.FC<AdminUserPageProps> = ({ onNavigate }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const resp: any = await axiosClient.get('/admin/users', {
                params: {
                    page: currentPage,
                    limit: 10,
                    search: search || undefined
                }
            });
            // Backend returns { totalUsers, totalPages, currentPage, users }
            setUsers(resp.users || []);
            setTotalUsers(resp.totalUsers || 0);
            setTotalPages(resp.totalPages || 1);
            setError(null);
        } catch (err: any) {
            console.error('Failed to fetch users', err);
            setError(err.message || 'Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, search]);

    const handleRoleUpdate = async (userId: number, newRole: string) => {
        try {
            await axiosClient.put(`/admin/users/${userId}`, { role: newRole });
            fetchUsers();
        } catch (err: any) {
            alert(err.message || 'Lỗi khi cập nhật quyền');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
        try {
            await axiosClient.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch (err: any) {
            alert(err.message || 'Lỗi khi xóa người dùng');
        }
    };

    return (
        <AdminLayout activePage="customers" onNavigate={onNavigate}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main">Quản lý khách hàng</h1>
                        <p className="text-text-sub text-sm">Xem và quản lý thông tin người dùng trong hệ thống</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-text-sub uppercase tracking-wider">Người dùng</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-sub uppercase tracking-wider">Số điện thoại</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-sub uppercase tracking-wider">Quyền</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-sub uppercase tracking-wider">Ngày tham gia</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-text-sub uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-4">
                                                <div className="h-12 bg-gray-100 rounded-lg"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : users.length > 0 ? (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.fullname} className="size-full object-cover" />
                                                        ) : (
                                                            user.fullname.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-text-main">{user.fullname}</span>
                                                        <span className="text-xs text-text-sub">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-main">
                                                {user.phone || 'Chưa cập nhật'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                    className={`text-xs font-semibold px-2 py-1 rounded-full border-none outline-none focus:ring-2 focus:ring-primary/20 ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    <option value="customer">Customer</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-sub">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* <button className="p-2 text-text-sub hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button> */}
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-text-sub hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-text-sub">
                                            Không tìm thấy người dùng nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                            <p className="text-sm text-text-sub">
                                Hiển thị trang <span className="font-medium text-text-main">{currentPage}</span> / {totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="p-2 text-text-sub hover:text-primary disabled:opacity-30 disabled:hover:text-text-sub transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="p-2 text-text-sub hover:text-primary disabled:opacity-30 disabled:hover:text-text-sub transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUserPage;
