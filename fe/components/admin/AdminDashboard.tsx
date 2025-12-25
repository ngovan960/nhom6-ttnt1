import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { backendApi } from '../../services/product.service'; // Assuming axios instance is here or create new service

interface RevenueStat {
    date: string;
    revenue: string;
    order_count: string;
}

interface BestSeller {
    product_id: number;
    total_sold: string;
    Product: {
        name: string;
        price: string;
        image: string;
        stock: number;
    }
}

interface AdminDashboardProps {
    onNavigate: (page: 'dashboard' | 'products' | 'orders' | 'coupons' | 'customers' | 'home') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
    const [revenueStats, setRevenueStats] = useState<RevenueStat[]>([]);
    const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Assuming we have these endpoints or will create a service for them
                // For now using backendApi from product.service to make calls
                // Fetch stats independently so one failure doesn't block the other
                try {
                    const revenueRes = await backendApi.get('/stats/revenue');
                    setRevenueStats((revenueRes as any) || []);
                } catch (err) {
                    console.error("Failed to fetch revenue stats", err);
                }

                try {
                    const bestSellersRes = await backendApi.get('/stats/best-sellers');
                    setBestSellers((bestSellersRes as any) || []);
                } catch (err) {
                    console.error("Failed to fetch best sellers", err);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate totals
    const totalRevenue = revenueStats.reduce((acc, curr) => acc + Number(curr.revenue), 0);
    const totalOrders = revenueStats.reduce((acc, curr) => acc + Number(curr.order_count), 0);

    return (
        <AdminLayout activePage="dashboard" onNavigate={onNavigate}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main tracking-tight">Tổng quan doanh số</h2>
                        <p className="text-text-sub text-sm mt-1">Theo dõi hiệu suất kinh doanh của cửa hàng.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 shadow-sm transition-all">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Xuất báo cáo
                        </button>
                        <button
                            onClick={() => onNavigate('products')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Thêm sản phẩm
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-50 flex flex-col gap-4 group hover:shadow-soft transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-blue-50 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +--%
                            </span>
                        </div>
                        <div>
                            <p className="text-text-sub text-sm font-medium">Doanh thu tổng</p>
                            <h3 className="text-3xl font-bold text-text-main mt-1">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-50 flex flex-col gap-4 group hover:shadow-soft transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">shopping_cart</span>
                            </div>
                            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +--%
                            </span>
                        </div>
                        <div>
                            <p className="text-text-sub text-sm font-medium">Tổng đơn hàng</p>
                            <h3 className="text-3xl font-bold text-text-main mt-1">{totalOrders}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-50 flex flex-col gap-4 group hover:shadow-soft transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">star</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-text-sub text-sm font-medium">Sản phẩm bán chạy nhất</p>
                            <h3 className="text-xl font-bold text-text-main mt-1 truncate">
                                {bestSellers.length > 0 ? bestSellers[0].Product?.name : 'Chưa có số liệu'}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Simple Chart Visualization Placeholder */}
                    <div className="bg-white rounded-xl shadow-card border border-gray-50 p-6 lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-text-main">Doanh thu gần đây</h3>
                                <p className="text-sm text-text-sub">Biểu đồ doanh thu theo ngày</p>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2">
                            {revenueStats.slice(0, 7).map((stat, index) => (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <div
                                        className="w-full bg-primary/20 hover:bg-primary transition-colors rounded-t-sm relative group"
                                        style={{ height: `${(Number(stat.revenue) / (totalRevenue || 1)) * 100 * 3}%`, minHeight: '4px' }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(stat.revenue))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-text-sub mt-2">{new Date(stat.date).getDate()}/{new Date(stat.date).getMonth() + 1}</span>
                                </div>
                            ))}
                            {revenueStats.length === 0 && <p className="text-center w-full text-text-sub">Chưa có dữ liệu</p>}
                        </div>
                    </div>

                    {/* Top Products List */}
                    <div className="bg-white rounded-xl shadow-card border border-gray-50 p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-text-main mb-1">Top Sản phẩm</h3>
                        <p className="text-sm text-text-sub mb-6">Xếp hạng theo số lượng bán</p>

                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                            {bestSellers.map((item) => (
                                <div key={item.product_id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0">
                                    <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                        {item.Product?.image ? (
                                            <img src={item.Product.image} alt={item.Product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="material-symbols-outlined text-gray-400">image</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-text-main truncate">{item.Product?.name}</p>
                                        <p className="text-xs text-text-sub">{item.total_sold} đã bán</p>
                                    </div>
                                </div>
                            ))}
                            {bestSellers.length === 0 && <p className="text-text-sub text-center">Chưa có dữ liệu</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
