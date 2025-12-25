import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { backendApi } from '../../services/product.service';

interface Coupon {
    id: number;
    code: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
    quantity: number;
    status: string;
    minOrderAmount?: number;
    maxDiscount?: number;
    description?: string;
}

interface AdminCouponPageProps {
    onNavigate: (page: 'dashboard' | 'products' | 'categories' | 'orders' | 'coupons' | 'customers' | 'home') => void;
}

const AdminCouponPage: React.FC<AdminCouponPageProps> = ({ onNavigate }) => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percent',
        discountValue: '',
        startDate: '',
        endDate: '',
        quantity: '',
        minOrderAmount: '',
        maxDiscount: '',
        description: ''
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await backendApi.get('/coupons');
            // Adjust if backend returns { data: [...] } or just [...]
            // Based on controller it returns res.json(coupons) so it's array
            setCoupons(res.data || (Array.isArray(res) ? res : []));
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percent',
            discountValue: '',
            startDate: '',
            endDate: '',
            quantity: '',
            minOrderAmount: '',
            maxDiscount: '',
            description: ''
        });
        setEditingCoupon(null);
    };

    const handleEditClick = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue.toString(),
            startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
            endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
            quantity: coupon.quantity ? coupon.quantity.toString() : '',
            minOrderAmount: coupon.minOrderAmount ? coupon.minOrderAmount.toString() : '',
            maxDiscount: coupon.maxDiscount ? coupon.maxDiscount.toString() : '',
            description: coupon.description || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parseDate = (d: string) => d ? new Date(d) : null;

            const payload = {
                ...formData,
                discountValue: Number(formData.discountValue),
                quantity: formData.quantity ? Number(formData.quantity) : null,
                minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : null,
                maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
                startDate: parseDate(formData.startDate),
                endDate: parseDate(formData.endDate),
            };

            if (editingCoupon) {
                await backendApi.put(`/coupons/${editingCoupon.id}`, payload);
            } else {
                await backendApi.post('/coupons', payload);
            }

            setShowModal(false);
            resetForm();
            fetchCoupons();
        } catch (error: any) {
            console.error("Failed to save coupon", error);
            alert(error.message || "Lỗi khi lưu mã giảm giá");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa mã này?")) return;
        try {
            await backendApi.delete(`/coupons/${id}`);
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete coupon", error);
            alert("Xóa mã thất bại");
        }
    };

    return (
        <AdminLayout activePage="coupons" onNavigate={onNavigate}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main tracking-tight">Quản lý Khuyến mãi</h2>
                        <p className="text-text-sub text-sm mt-1">Tạo và quản lý các mã giảm giá cho khách hàng.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Tạo mã mới
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-card border border-gray-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-light/50 border-b border-gray-100 text-xs uppercase text-text-sub font-semibold tracking-wide">
                                    <th className="px-6 py-4">Mã Coupon</th>
                                    <th className="px-6 py-4">Giảm giá</th>
                                    <th className="px-6 py-4">Thời gian</th>
                                    <th className="px-6 py-4">Số lượng</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-4">Đang tải...</td></tr>
                                ) : coupons.map((coupon) => (
                                    <tr key={coupon.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-primary font-mono bg-blue-50 px-2 py-0.5 rounded w-fit">{coupon.code}</span>
                                                <span className="text-xs text-text-sub mt-1">{coupon.description}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-main">
                                            {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.discountValue)}
                                            {coupon.maxDiscount && <span className="text-xs text-text-sub block">Tối đa {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.maxDiscount)}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-sub">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                    {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString('vi-VN') : '---'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">event_busy</span>
                                                    {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString('vi-VN') : '---'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-text-main">
                                            {coupon.quantity !== null ? coupon.quantity : '∞'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${coupon.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                                    `}>
                                                {coupon.status === 'active' ? 'Đang hoạt động' : 'Hết hạn/Ẩn'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(coupon)}
                                                    className="p-2 text-text-sub hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="p-2 text-text-sub hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-gray-100">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                                    <h3 className="text-lg font-bold text-text-main" id="modal-title">
                                        {editingCoupon ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
                                    </h3>
                                    <button type="button" onClick={() => setShowModal(false)} className="text-text-sub hover:text-text-main transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main">Mã giảm giá (Code) *</label>
                                        <input required name="code" value={formData.code} onChange={handleInputChange} className="uppercase w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono" type="text" placeholder="VD: SUMMER2024" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Loại giảm giá</label>
                                            <select name="discountType" value={formData.discountType} onChange={(e) => setFormData(p => ({ ...p, discountType: e.target.value as any }))} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                                                <option value="percent">Phần trăm (%)</option>
                                                <option value="fixed">Số tiền cố định</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Giá trị giảm *</label>
                                            <input required name="discountValue" type="number" value={formData.discountValue} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Ngày bắt đầu</label>
                                            <input name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Ngày kết thúc</label>
                                            <input name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Số lượng giới hạn</label>
                                            <input name="quantity" type="number" placeholder="Bỏ trống nếu không giới hạn" value={formData.quantity} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Đơn tối thiểu</label>
                                            <input name="minOrderAmount" type="number" value={formData.minOrderAmount} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main">Mô tả</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"></textarea>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 transition-colors">Hủy bỏ</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Lưu mã</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default AdminCouponPage;
