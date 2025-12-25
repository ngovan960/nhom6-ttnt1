import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { backendApi } from '../../services/product.service';

interface Order {
    id: number;
    user_id: number;
    fullname: string; // from creation or user join
    total_price: string;
    status: string;
    createdAt: string;
    // Add other fields as needed
}

interface AdminOrderPageProps {
    onNavigate: (page: 'dashboard' | 'products' | 'categories' | 'orders' | 'coupons' | 'customers' | 'home') => void;
}

const AdminOrderPage: React.FC<AdminOrderPageProps> = ({ onNavigate }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Construct query param for status if needed
            const endpoint = filterStatus === 'all' ? '/admin/orders' : `/admin/orders?status=${filterStatus}`;
            const res: any = await backendApi.get(endpoint);
            setOrders(res.orders || []);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            await backendApi.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            fetchOrders(); // Refresh list
        } catch (error: any) {
            console.error("Failed to update status", error);
            alert(error.message || "Cập nhật trạng thái thất bại");
        }
    };

    const handleDelete = async (orderId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
        try {
            await backendApi.delete(`/admin/orders/${orderId}`);
            setOrders(orders.filter(o => o.id !== orderId));
        } catch (error: any) {
            console.error("Failed to delete order", error);
            alert(error.message || "Xóa đơn hàng thất bại");
        }
    }

    return (
        <AdminLayout activePage="orders" onNavigate={onNavigate}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main tracking-tight">Quản lý Đơn hàng</h2>
                        <p className="text-text-sub text-sm mt-1">Xem, lọc và cập nhật trạng thái đơn hàng.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 shadow-sm transition-all">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Xuất Excel
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-card border border-gray-50 flex flex-col h-full">
                    <div className="p-5 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-sub text-[18px]">search</span>
                            <input className="pl-9 pr-4 py-2 bg-background-light border-none rounded-lg text-sm w-64 focus:ring-1 focus:ring-primary placeholder-text-sub outline-none" placeholder="Tìm kiếm đơn hàng..." type="text" />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="py-2 pl-3 pr-8 bg-background-light border-none rounded-lg text-sm text-text-main focus:ring-1 focus:ring-primary cursor-pointer outline-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="shipping">Đang giao</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-light/50 border-b border-gray-100 text-xs uppercase text-text-sub font-semibold tracking-wide">
                                    <th className="px-6 py-4">ID Đơn hàng</th>
                                    <th className="px-6 py-4">Khách hàng</th>
                                    <th className="px-6 py-4">Ngày đặt</th>
                                    <th className="px-6 py-4">Tổng tiền</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-4">Đang tải...</td></tr>
                                ) : orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-text-main">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {order.fullname ? order.fullname.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <span className="text-sm text-text-main">{order.fullname || 'Khách lẻ'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-sub">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-text-main">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.total_price))}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
                                        ${order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                                        order.status === 'shipping' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                            'bg-orange-100 text-orange-700 border-orange-200'
                                                }
                                     `}>
                                                <span className={`size-1.5 rounded-full 
                                            ${order.status === 'completed' ? 'bg-green-600' :
                                                        order.status === 'cancelled' ? 'bg-red-600' :
                                                            order.status === 'shipping' ? 'bg-blue-600' :
                                                                'bg-orange-600'
                                                    }
                                        `}></span>
                                                {order.status === 'completed' ? 'Hoàn thành' :
                                                    order.status === 'cancelled' ? 'Đã hủy' :
                                                        order.status === 'shipping' ? 'Đang giao' : 'Chờ xử lý'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Status Actions Mockup */}
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'shipping')}
                                                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"
                                                        title="Giao hàng"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                                                    </button>
                                                )}
                                                {order.status === 'shipping' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                        className="text-green-600 hover:bg-green-50 p-1.5 rounded"
                                                        title="Hoàn thành"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="text-text-sub hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                                                    title="Xóa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-text-sub">Hiển thị <span className="font-bold text-text-main">{orders.length}</span> đơn hàng</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderPage;
