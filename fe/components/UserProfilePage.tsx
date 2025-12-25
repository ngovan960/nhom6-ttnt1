import React, { useState } from 'react';
import { User } from './Header';
import { useAuthStore } from '../store/useAuthStore';

import { addressService } from '../services/address.service';
import { orderService, Order } from '../services/order.service';

interface UserProfilePageProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
  onFavoritesClick: () => void;
  onAddressClick: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onLogout, onBack, onFavoritesClick, onAddressClick }) => {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || '');
  const [phoneValue, setPhoneValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  React.useEffect(() => {
    (async () => {
      try {
        const list = await addressService.getMyAddresses();
        if (Array.isArray(list) && list.length > 0) {
          const def = list.find((a: any) => a.is_default);
          setDefaultAddress(def || list[0]);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      setLoadingOrders(true);
      try {
        const { orders: fetchedOrders } = await orderService.getMyOrders();
        setOrders(fetchedOrders || []);
      } catch (e) {
        console.error('Error fetching orders:', e);
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    if (user?.id) {
      (async () => {
        try {
          const { wishlistService } = await import('../services/wishlist.service');
          const { data } = await wishlistService.getWishlist(user.id);
          setWishlistCount(data?.length || 0);
        } catch (e) {
          console.error('Error fetching wishlist:', e);
        }
      })();
    }
  }, [user]);

  const handleEdit = () => {
    setNameValue(user?.name || '');
    setEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // send fullname and phone to backend; backend uses token to find user
      const updated = await updateProfile({ fullname: nameValue, phone: phoneValue });
      alert('Cập nhật hồ sơ thành công');
      setEditing(false);
    } catch (err: any) {
      const message = err?.message || err?.error || JSON.stringify(err);
      alert(message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setSaving(false);
    }
  };

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipping': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-inter">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex mb-6">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button onClick={onBack} className="inline-flex items-center text-sm font-medium text-[#60608a] hover:text-[#0d0df2]">
              <span className="material-symbols-outlined text-lg mr-1">home</span>
              Trang chủ
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[#dbdbe6]">chevron_right</span>
              <span className="ml-1 text-sm font-medium text-[#111118] dark:text-white md:ml-2">Tài khoản của tôi</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
          {/* User Mini Profile */}
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl p-5 shadow-sm border border-[#f0f0f5] dark:border-gray-800 flex items-center gap-4">
            <div className="relative">
              <div
                className="size-14 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-gray-700 shadow-md"
                style={{ backgroundImage: `url('${user.avatar}')` }}
              ></div>
              <div className="absolute bottom-0 right-0 bg-green-500 size-3.5 rounded-full border-2 border-white dark:border-[#1a1a2e]"></div>
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-[#111118] dark:text-white truncate">{user.name}</h3>
              <p className="text-xs text-[#60608a] dark:text-gray-400 truncate">Thành viên Bạc</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="bg-white dark:bg-[#1a1a2e] rounded-xl shadow-sm border border-[#f0f0f5] dark:border-gray-800 overflow-hidden">
            <div className="p-2 space-y-1">
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0d0df2]/10 text-[#0d0df2] font-medium transition-colors cursor-pointer">
                <span className="material-symbols-outlined fill">dashboard</span>
                Tổng quan
              </a>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#60608a] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-gray-800 hover:text-[#111118] dark:hover:text-white transition-colors group cursor-pointer">
                <span className="material-symbols-outlined group-hover:text-[#0d0df2] transition-colors">person</span>
                Thông tin cá nhân
              </a>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#60608a] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-gray-800 hover:text-[#111118] dark:hover:text-white transition-colors group cursor-pointer">
                <span className="material-symbols-outlined group-hover:text-[#0d0df2] transition-colors">inventory_2</span>
                Lịch sử đơn hàng
                <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
              </a>
              <a
                onClick={onFavoritesClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#60608a] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-gray-800 hover:text-[#111118] dark:hover:text-white transition-colors group cursor-pointer"
              >
                <span className="material-symbols-outlined group-hover:text-[#0d0df2] transition-colors">favorite</span>
                Danh sách yêu thích
              </a>
              <a onClick={onAddressClick} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#60608a] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-gray-800 hover:text-[#111118] dark:hover:text-white transition-colors group cursor-pointer">
                <span className="material-symbols-outlined group-hover:text-[#0d0df2] transition-colors">location_on</span>
                Sổ địa chỉ
              </a>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#60608a] dark:text-gray-400 hover:bg-[#f0f0f5] dark:hover:bg-gray-800 hover:text-[#111118] dark:hover:text-white transition-colors group cursor-pointer">
                <span className="material-symbols-outlined group-hover:text-[#0d0df2] transition-colors">settings</span>
                Cài đặt tài khoản
              </a>
              <div className="h-px bg-[#f0f0f5] dark:bg-gray-800 my-2 mx-2"></div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#60608a] dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                Đăng xuất
              </button>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[#111118] dark:text-white">Tổng quan</h1>
              <p className="text-[#60608a] dark:text-gray-400 mt-1">Xin chào {user.name}, chào mừng bạn quay trở lại TechZone.</p>
            </div>
            {!editing ? (
              <button onClick={handleEdit} className="inline-flex items-center justify-center gap-2 bg-[#0d0df2] hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-[#0d0df2]/30">
                <span className="material-symbols-outlined text-sm">edit</span>
                Cập nhật hồ sơ
              </button>
            ) : (
              <form onSubmit={handleSave} className="inline-flex items-center gap-2">
                <input value={nameValue} onChange={(e) => setNameValue(e.target.value)} className="px-3 py-2 rounded border" />
                <input value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} className="px-3 py-2 rounded border" placeholder="Số điện thoại" />
                <button type="submit" disabled={saving} className="px-3 py-2 rounded bg-green-600 text-white">{saving ? 'Đang lưu...' : 'Lưu'}</button>
                <button type="button" onClick={() => setEditing(false)} className="px-3 py-2 rounded border">Hủy</button>
              </form>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stat Card 1 */}
            <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-xl border border-[#f0f0f5] dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#60608a] dark:text-gray-400">Đơn hàng chờ xử lý</p>
                <p className="text-3xl font-bold text-[#111118] dark:text-white mt-1">{loadingOrders ? '...' : String(pendingOrdersCount).padStart(2, '0')}</p>
              </div>
              <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined fill">local_shipping</span>
              </div>
            </div>
            {/* Stat Card 2 */}
            <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-xl border border-[#f0f0f5] dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#60608a] dark:text-gray-400">Sản phẩm yêu thích</p>
                <p className="text-3xl font-bold text-[#111118] dark:text-white mt-1">{loadingOrders ? '...' : String(wishlistCount).padStart(2, '0')}</p>
              </div>
              <div className="size-12 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 cursor-pointer" onClick={onFavoritesClick}>
                <span className="material-symbols-outlined fill">favorite</span>
              </div>
            </div>
            {/* Stat Card 3 */}
            <div className="bg-white dark:bg-[#1a1a2e] p-5 rounded-xl border border-[#f0f0f5] dark:border-gray-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#60608a] dark:text-gray-400">Điểm tích lũy</p>
                <p className="text-3xl font-bold text-[#111118] dark:text-white mt-1">350</p>
              </div>
              <div className="size-12 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined fill">loyalty</span>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl shadow-sm border border-[#f0f0f5] dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-[#f0f0f5] dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111118] dark:text-white">Đơn hàng gần đây</h2>
              <a className="text-sm font-semibold text-[#0d0df2] hover:text-[#0d0df2]/80 cursor-pointer">Xem tất cả</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f9fafb] dark:bg-gray-800 text-[#60608a] dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-3 font-medium">Mã đơn hàng</th>
                    <th className="px-5 py-3 font-medium">Ngày đặt</th>
                    <th className="px-5 py-3 font-medium">Sản phẩm</th>
                    <th className="px-5 py-3 font-medium">Tổng tiền</th>
                    <th className="px-5 py-3 font-medium">Trạng thái</th>
                    <th className="px-5 py-3 font-medium text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f5] dark:divide-gray-800">
                  {loadingOrders ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-[#60608a]">Đang tải đơn hàng...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-[#60608a]">Bạn chưa có đơn hàng nào.</td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order) => {
                      const firstItem = order.OrderItems?.[0];
                      const productNames = order.OrderItems?.map(item => item.Product.name).join(', ');
                      const displayProducts = productNames?.length > 30 ? productNames.substring(0, 30) + '...' : productNames;

                      return (
                        <tr key={order.id} className="hover:bg-[#f9fafb] dark:hover:bg-gray-800 transition-colors">
                          <td className="px-5 py-4 font-medium text-[#111118] dark:text-white">#ORD-{order.id}</td>
                          <td className="px-5 py-4 text-[#60608a] dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-5 py-4 text-[#111118] dark:text-white">
                            {displayProducts || 'N/A'}
                          </td>
                          <td className="px-5 py-4 font-medium text-[#111118] dark:text-white">
                            {Number(order.total_price).toLocaleString('vi-VN')}₫
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="text-[#60608a] dark:text-gray-400 hover:text-[#0d0df2] font-medium">Chi tiết</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Personal Information Summary */}
          <div className="bg-white dark:bg-[#1a1a2e] rounded-xl shadow-sm border border-[#f0f0f5] dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-[#f0f0f5] dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111118] dark:text-white">Thông tin tài khoản</h2>
              <button
                onClick={handleEdit}
                className="text-sm font-semibold text-[#0d0df2] hover:text-[#0d0df2]/80"
              >
                Chỉnh sửa
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-5 border-b md:border-b-0 md:border-r border-[#f0f0f5] dark:border-gray-800">
                <h3 className="text-sm font-semibold text-[#111118] dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#60608a] dark:text-gray-400 text-lg">person</span>
                  Chi tiết liên hệ
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-xs text-[#60608a] dark:text-gray-400 uppercase tracking-wider">Họ và tên</dt>
                    <dd className="text-sm font-medium text-[#111118] dark:text-white mt-0.5">{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#60608a] dark:text-gray-400 uppercase tracking-wider">Email</dt>
                    <dd className="text-sm font-medium text-[#111118] dark:text-white mt-0.5">{user.email || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#60608a] dark:text-gray-400 uppercase tracking-wider">Số điện thoại</dt>
                    <dd className="text-sm font-medium text-[#111118] dark:text-white mt-0.5">{user.phone || 'Chưa cập nhật'}</dd>
                  </div>
                </dl>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-[#111118] dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#60608a] dark:text-gray-400 text-lg">home</span>
                  Địa chỉ mặc định
                </h3>
                {defaultAddress ? (
                  <div className="bg-[#f9fafb] dark:bg-gray-800 p-3 rounded-lg border border-[#f0f0f5] dark:border-gray-700">
                    <p className="text-sm font-medium text-[#111118] dark:text-white flex items-center gap-2">
                      {defaultAddress.full_name}
                      <span className="text-xs font-normal text-gray-500">({defaultAddress.phone})</span>
                    </p>
                    <p className="text-sm text-[#60608a] dark:text-gray-400 mt-1 leading-relaxed">
                      {defaultAddress.address_detail}, {defaultAddress.ward}<br />
                      {defaultAddress.district}, {defaultAddress.city}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-dashed text-center">
                    <p className="text-sm text-gray-500">Chưa có địa chỉ mặc định</p>
                  </div>
                )}
                <button
                  onClick={onAddressClick}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-[#0d0df2]/40 text-[#0d0df2] hover:bg-[#0d0df2]/5 hover:border-[#0d0df2] dark:border-blue-500/40 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-all text-sm font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Thêm địa chỉ mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
