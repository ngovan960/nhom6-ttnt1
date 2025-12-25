import React, { useState, useEffect } from 'react';
import { backendApi } from '../services/product.service';

interface Address {
    id: number;
    full_name: string;
    phone: string;
    address_detail: string;
    city: string;
    district: string;
    ward: string;
    is_default: boolean;
}

interface UserAddressPageProps {
    onBack: () => void;
    autoOpen?: boolean;
}

const UserAddressPage: React.FC<UserAddressPageProps> = ({ onBack, autoOpen }) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        address_detail: '',
        is_default: false
    });

    useEffect(() => {
        fetchAddresses();
        if (autoOpen) {
            setShowModal(true);
        }
    }, [autoOpen]);

    const fetchAddresses = async () => {
        try {
            console.log("Fetching addresses...");
            if (!backendApi) {
                console.error("Backend API not initialized");
                return;
            }
            setLoading(true);
            const res = await backendApi.get('/address');
            console.log("Addresses loaded:", res);
            // axios interceptor returns data directly
            const list = Array.isArray(res) ? res : (res as any)?.data || [];
            setAddresses(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            phone: '',
            city: '',
            district: '',
            ward: '',
            address_detail: '',
            is_default: false
        });
        setEditingAddress(null);
    };

    const handleEditClick = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            full_name: address.full_name,
            phone: address.phone,
            city: address.city,
            district: address.district,
            ward: address.ward,
            address_detail: address.address_detail,
            is_default: address.is_default
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting address form...", formData);

        // Basic validation check
        if (!formData.city || !formData.district || !formData.ward) {
            console.error("Missing location fields");
        }

        try {
            const payload = { ...formData };
            console.log("Payload:", payload);

            if (editingAddress) {
                console.log("Updating address:", editingAddress.id);
                await backendApi.put(`/address/${editingAddress.id}`, payload);
            } else {
                console.log("Creating new address");
                await backendApi.post('/address', payload);
            }

            console.log("Address saved successfully");
            setShowModal(false);
            resetForm();
            fetchAddresses();
        } catch (error: any) {
            console.error("Failed to save address", error);
            // Show more detailed error to user
            const msg = error?.response?.data?.message || error.message || "Lỗi không xác định";
            alert(`Lỗi khi lưu địa chỉ: ${msg}`);
        }
    };


    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
        try {
            await backendApi.delete(`/address/${id}`);
            setAddresses(addresses.filter(a => a.id !== id));
        } catch (error) {
            console.error("Failed to delete address", error);
            alert("Xóa địa chỉ thất bại");
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await backendApi.put(`/address/${id}`, { is_default: true });
            fetchAddresses();
        } catch (error) {
            console.error("Failed to set default", error);
        }
    }

    return (
        <div className="flex-grow w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav aria-label="Breadcrumb" className="flex mb-6">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-[#60608a] hover:text-primary">
                            <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
                            Quay lại
                        </button>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-[#dbdbe6]">chevron_right</span>
                            <span className="ml-1 text-sm font-medium text-[#111118] md:ml-2">Sổ địa chỉ</span>
                        </div>
                    </li>
                </ol>
            </nav>

            <div className="bg-white rounded-xl shadow-sm border border-[#f0f0f5] overflow-hidden max-w-4xl mx-auto">
                <div className="p-5 border-b border-[#f0f0f5] flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#111118]">Sổ địa chỉ giao hàng</h2>
                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-base">add</span> Thêm mới
                    </button>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? <p>Đang tải...</p> : addresses.map(addr => (
                        <div key={addr.id} className={`border rounded-lg p-4 transition-colors relative ${addr.is_default ? 'border-primary/30 bg-primary/5' : 'border-[#f0f0f5] hover:border-[#dbdbe6]'}`}>
                            {addr.is_default && (
                                <div className="absolute top-4 right-4 text-primary">
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                </div>
                            )}
                            {addr.is_default && <span className="text-xs font-bold text-primary bg-white px-2 py-1 rounded border border-primary/20">Mặc định</span>}

                            <h4 className="font-semibold text-[#111118] mt-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">location_on</span> {addr.full_name}
                            </h4>
                            <p className="text-sm text-[#60608a] mt-1">{addr.phone}</p>
                            <p className="text-sm text-[#60608a] mt-2 line-clamp-2 leading-relaxed">
                                {addr.address_detail}, {addr.ward}, {addr.district}, {addr.city}
                            </p>

                            <div className="mt-4 flex gap-3 pt-3 border-t border-primary/10">
                                {!addr.is_default && (
                                    <button onClick={() => handleSetDefault(addr.id)} className="text-xs font-medium text-primary hover:text-primary/80">Đặt mặc định</button>
                                )}
                                <button onClick={() => handleEditClick(addr)} className="text-xs font-medium text-[#60608a] hover:text-primary">Chỉnh sửa</button>
                                <button onClick={() => handleDelete(addr.id)} className="text-xs font-medium text-red-500 hover:text-red-700 ml-auto">Xóa</button>
                            </div>
                        </div>
                    ))}
                    {!loading && addresses.length === 0 && <p className="col-span-2 text-center text-text-sub">Chưa có địa chỉ nào.</p>}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/50 transition-opacity backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="relative inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-[#f0f0f5]">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-6 py-5 border-b border-[#f0f0f5] flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-[#111118]">
                                        {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
                                    </h3>
                                    <button type="button" onClick={() => setShowModal(false)} className="size-8 rounded-full flex items-center justify-center text-[#60608a] hover:bg-[#f0f0f5] hover:text-[#111118] transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="px-6 py-2 border-b border-[#f0f0f5] bg-[#fdfdfd]">
                                    <p className="text-sm text-[#60608a]">Thông tin liên hệ của bạn để nhận hàng.</p>
                                </div>

                                <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-[#111118]">Họ và tên</label>
                                            <input required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="block w-full rounded-lg border-[#dbdbe6] bg-white text-sm text-[#111118] shadow-sm focus:border-primary focus:ring-primary/20 placeholder:text-[#a0a0b8] h-11" type="text" placeholder="Nhập họ tên đầy đủ" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-[#111118]">Số điện thoại</label>
                                            <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="block w-full rounded-lg border-[#dbdbe6] bg-white text-sm text-[#111118] shadow-sm focus:border-primary focus:ring-primary/20 placeholder:text-[#a0a0b8] h-11" type="tel" placeholder="Nhập số điện thoại" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-[#111118]">Tỉnh/Thành phố</label>
                                            <select required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="block w-full rounded-lg border-[#dbdbe6] bg-white text-sm text-[#111118] h-11 px-3">
                                                <option value="">Chọn Tỉnh/Thành</option>
                                                <option value="Hà Nội">Hà Nội</option>
                                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                                <option value="Đà Nẵng">Đà Nẵng</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-[#111118]">Quận/Huyện</label>
                                            <select required value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="block w-full rounded-lg border-[#dbdbe6] bg-white text-sm text-[#111118] h-11 px-3">
                                                <option value="">Chọn Quận/Huyện</option>
                                                <option value="Quận 1">Quận 1</option>
                                                <option value="Quận 2">Quận 2</option>
                                                <option value="Quận 3">Quận 3</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-semibold text-[#111118]">Phường/Xã</label>
                                            <select required value={formData.ward} onChange={(e) => setFormData({ ...formData, ward: e.target.value })} className="block w-full rounded-lg border-[#dbdbe6] bg-white text-sm text-[#111118] h-11 px-3">
                                                <option value="">Chọn Phường/Xã</option>
                                                <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                                                <option value="Phường Bến Thành">Phường Bến Thành</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-[#111118]">Địa chỉ cụ thể</label>
                                        <textarea required value={formData.address_detail} onChange={(e) => setFormData({ ...formData, address_detail: e.target.value })} className="block w-full rounded-lg border-[#dbdbe6] bg-white text-sm text-[#111118] resize-none p-3" rows={2} placeholder="Số nhà, tên đường, tòa nhà, khu dân cư..."></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-[#111118]">Loại địa chỉ</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`cursor-pointer border rounded-lg p-4 flex items-center gap-3 transition-all ${formData.address_detail.startsWith('Nhà riêng') ? 'border-primary bg-primary/5' : 'border-[#dbdbe6] hover:border-primary/50'}`}>
                                                <input type="radio" name="address_type" className="hidden"
                                                    checked={!!formData.address_detail.includes('(Nhà riêng)')}
                                                    onChange={() => setFormData({ ...formData, address_detail: formData.address_detail.replace(/ \((Nhà riêng|Văn phòng)\)$/, '') + ' (Nhà riêng)' })}
                                                />
                                                <div className={`size-10 rounded-full flex items-center justify-center ${formData.address_detail.includes('(Nhà riêng)') ? 'bg-primary text-white' : 'bg-[#f0f0f5] text-[#60608a]'}`}>
                                                    <span className="material-symbols-outlined">home</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm">Nhà riêng</div>
                                                    <div className="text-xs text-[#60608a]">Nhận hàng mọi ngày trong tuần</div>
                                                </div>
                                                {formData.address_detail.includes('(Nhà riêng)') && <span className="material-symbols-outlined text-primary">check_circle</span>}
                                            </label>

                                            <label className={`cursor-pointer border rounded-lg p-4 flex items-center gap-3 transition-all ${formData.address_detail.includes('(Văn phòng)') ? 'border-primary bg-primary/5' : 'border-[#dbdbe6] hover:border-primary/50'}`}>
                                                <input type="radio" name="address_type" className="hidden"
                                                    checked={!!formData.address_detail.includes('(Văn phòng)')}
                                                    onChange={() => setFormData({ ...formData, address_detail: formData.address_detail.replace(/ \((Nhà riêng|Văn phòng)\)$/, '') + ' (Văn phòng)' })}
                                                />
                                                <div className={`size-10 rounded-full flex items-center justify-center ${formData.address_detail.includes('(Văn phòng)') ? 'bg-primary text-white' : 'bg-[#f0f0f5] text-[#60608a]'}`}>
                                                    <span className="material-symbols-outlined">apartment</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-sm">Văn phòng</div>
                                                    <div className="text-xs text-[#60608a]">Nhận hàng giờ hành chính</div>
                                                </div>
                                                {formData.address_detail.includes('(Văn phòng)') && <span className="material-symbols-outlined text-primary">check_circle</span>}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-[#f9fafb] rounded-lg border border-[#f0f0f5]">
                                        <input checked={formData.is_default} onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })} className="size-5 rounded border-[#dbdbe6] text-primary focus:ring-primary bg-white cursor-pointer" type="checkbox" id="is_default" />
                                        <label className="ml-3 block text-sm font-medium text-[#111118] cursor-pointer" htmlFor="is_default">Đặt làm địa chỉ nhận hàng mặc định</label>
                                    </div>
                                </div>

                                <div className="bg-white px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-[#f0f0f5] justify-end">
                                    <button type="button" onClick={() => setShowModal(false)} className="inline-flex justify-center items-center gap-2 rounded-lg border border-[#dbdbe6] shadow-sm px-6 py-3 bg-white text-sm font-bold text-[#60608a] hover:bg-[#f5f5f8] hover:text-[#111118] transition-all">
                                        Hủy bỏ
                                    </button>
                                    <button type="submit" className="inline-flex justify-center items-center gap-2 rounded-lg border border-transparent shadow-md px-6 py-3 bg-primary text-sm font-bold text-white hover:bg-primary/90 transition-all">
                                        <span className="material-symbols-outlined text-lg">save</span> Lưu địa chỉ
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAddressPage;
