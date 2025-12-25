import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { backendApi, productService } from '../../services/product.service';
import { Product } from '../../types';

// Extend Product type for Admin usage if needed
interface AdminProduct extends Product {
    original_price?: number;
    stock: number;
    category_id: number;
}

interface Category {
    id: number;
    name: string;
}

interface AdminProductPageProps {
    onNavigate: (page: 'dashboard' | 'products' | 'categories' | 'orders' | 'coupons' | 'customers' | 'home') => void;
}

const AdminProductPage: React.FC<AdminProductPageProps> = ({ onNavigate }) => {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        original_price: '',
        stock: '',
        description: '',
        category_id: '',
        image: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAdminProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res: any = await backendApi.get('/categories');
            setCategories(res.data || (Array.isArray(res) ? res : []));
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            original_price: '',
            stock: '',
            description: '',
            category_id: '',
            image: ''
        });
        setEditingProduct(null);
    };

    const handleEditClick = (product: AdminProduct) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            original_price: product.original_price ? product.original_price.toString() : '',
            stock: product.stock.toString(),
            description: product.description || '',
            category_id: product.category_id.toString(),
            image: product.image || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                original_price: formData.original_price ? Number(formData.original_price) : null,
                stock: Number(formData.stock),
                category_id: Number(formData.category_id)
            };

            if (editingProduct) {
                await backendApi.put(`/products/${editingProduct.id}`, payload);
            } else {
                await backendApi.post('/products', payload);
            }

            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error: any) {
            console.error("Failed to save product", error);
            alert(error.message || "Lỗi khi lưu sản phẩm");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            await backendApi.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error: any) {
            console.error("Failed to delete product", error);
            alert(error.message || "Xóa sản phẩm thất bại");
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? product.category_id.toString() === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <AdminLayout activePage="products" onNavigate={onNavigate}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main tracking-tight">Quản lý Sản phẩm</h2>
                        <p className="text-text-sub text-sm mt-1">Quản lý danh sách, kho hàng và thông tin sản phẩm.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Thêm sản phẩm
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-sub text-[20px]">search</span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-background-light border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-main outline-none"
                                placeholder="Tìm tên sản phẩm..."
                                type="text"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="py-2.5 pl-3 pr-10 bg-background-light border border-gray-200 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer outline-none"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-card border border-gray-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-light/50 border-b border-gray-100 text-xs uppercase text-text-sub font-semibold tracking-wide">
                                    <th className="px-6 py-4">Sản phẩm</th>
                                    <th className="px-6 py-4">Danh mục</th>
                                    <th className="px-6 py-4">Giá bán</th>
                                    <th className="px-6 py-4">Tồn kho</th>
                                    <th className="px-6 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="text-center py-4">Đang tải...</td></tr>
                                ) : filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-gray-400">image</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors cursor-pointer">{product.name}</span>
                                                    <span className="text-xs text-text-sub">ID: {product.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-text-main">
                                            {categories.find(c => c.id === product.category_id)?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-text-main">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                <span className={`size-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {product.stock} trong kho
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="p-2 text-text-sub hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
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
                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                                    <h3 className="text-lg font-bold text-text-main" id="modal-title">
                                        {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                                    </h3>
                                    <button type="button" onClick={() => setShowModal(false)} className="text-text-sub hover:text-text-main transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main">Tên sản phẩm *</label>
                                        <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" type="text" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Danh mục *</label>
                                            <select required name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                                                <option value="">Chọn danh mục</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Tồn kho *</label>
                                            <input required name="stock" type="number" value={formData.stock} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Giá bán *</label>
                                            <input required name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-text-main">Giá gốc</label>
                                            <input name="original_price" type="number" value={formData.original_price} onChange={handleInputChange} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main">URL Hình ảnh</label>
                                        <input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" type="text" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-main">Mô tả</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full rounded-lg border border-gray-200 bg-background-light px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"></textarea>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 transition-colors">Hủy bỏ</button>
                                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Lưu sản phẩm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default AdminProductPage;
