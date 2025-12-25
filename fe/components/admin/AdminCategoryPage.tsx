import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { backendApi } from '../../services/product.service';

interface Category {
    id: number;
    name: string;
    description: string;
    parent_id: number | null;
}

interface AdminCategoryPageProps {
    onNavigate: (page: 'dashboard' | 'products' | 'categories' | 'orders' | 'coupons' | 'customers' | 'home') => void;
}

const AdminCategoryPage: React.FC<AdminCategoryPageProps> = ({ onNavigate }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_id: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res: any = await backendApi.get('/categories');
            setCategories(res.data || (Array.isArray(res) ? res : []));
        } catch (error) {
            console.error("Failed to fetch categories", error);
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
            name: '',
            description: '',
            parent_id: ''
        });
        setEditingCategory(null);
    };

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            parent_id: category.parent_id ? category.parent_id.toString() : ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                parent_id: formData.parent_id ? Number(formData.parent_id) : null
            };

            if (editingCategory) {
                await backendApi.put(`/categories/${editingCategory.id}`, payload);
            } else {
                await backendApi.post('/categories', payload);
            }

            setShowModal(false);
            resetForm();
            fetchCategories();
        } catch (error: any) {
            console.error("Failed to save category", error);
            alert(error.message || "Lỗi khi lưu danh mục");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
        try {
            await backendApi.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error: any) {
            console.error("Failed to delete category", error);
            alert(error.message || "Xóa danh mục thất bại");
        }
    };

    return (
        <AdminLayout activePage="categories" onNavigate={onNavigate}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main tracking-tight">Quản lý Danh mục</h2>
                        <p className="text-text-sub text-sm mt-1">Quản lý các nhóm sản phẩm trong hệ thống.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Thêm danh mục
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-card border border-gray-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-light/50 border-b border-gray-100 text-xs uppercase text-text-sub font-semibold tracking-wide">
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Tên danh mục</th>
                                    <th className="px-6 py-4">Mô tả</th>
                                    <th className="px-6 py-4">Danh mục cha</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-4">Đang tải...</td></tr>
                                ) : categories.map((category) => (
                                    <tr key={category.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-text-sub">#{category.id}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-text-main">{category.name}</td>
                                        <td className="px-6 py-4 text-sm text-text-sub">{category.description || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm text-text-main">
                                            {category.parent_id ? categories.find(c => c.id === category.parent_id)?.name || 'N/A' : 'Gốc'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(category)}
                                                    className="p-2 text-text-sub hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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
                                        {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                                    </h3>
                                    <button type="button" onClick={() => setShowModal(false)} className="text-text-sub hover:text-text-main transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="px-6 py-6 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main">Tên danh mục *</label>
                                        <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" type="text" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main">Danh mục cha</label>
                                        <select name="parent_id" value={formData.parent_id} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                                            <option value="">Gốc (Không có cha)</option>
                                            {categories.filter(c => c.id !== editingCategory?.id).map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main">Mô tả (Dùng làm icon nếu ở trang chủ)</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ví dụ: laptop, smartphone..."></textarea>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 transition-colors">Hủy bỏ</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Lưu danh mục</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCategoryPage;
