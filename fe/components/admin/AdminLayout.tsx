import React from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    activePage: 'dashboard' | 'products' | 'orders' | 'coupons' | 'customers';
    onNavigate: (page: 'dashboard' | 'products' | 'orders' | 'coupons' | 'customers' | 'home') => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePage, onNavigate }) => {
    return (
        <div className="flex h-screen w-full bg-background-light text-text-main font-display antialiased overflow-hidden">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-soft hidden md:flex flex-col h-full transition-transform">
                <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-50">
                    <div className="relative flex items-center justify-center size-10 rounded-xl bg-primary text-white shadow-lg shadow-blue-500/30">
                        <span className="material-symbols-outlined text-[24px]">bolt</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-text-main leading-none">TechAdmin</h1>
                        <p className="text-xs text-text-sub mt-1">Management Portal</p>
                    </div>
                </div>
                <nav className="flex-1 flex flex-col gap-1 px-4 py-6 overflow-y-auto">
                    <p className="px-2 text-xs font-semibold text-text-sub uppercase tracking-wider mb-2">Tổng quan</p>
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors w-full text-left ${activePage === 'dashboard'
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-sub hover:bg-gray-50 hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined" style={activePage === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>dashboard</span>
                        <span>Dashboard</span>
                    </button>

                    <p className="px-2 text-xs font-semibold text-text-sub uppercase tracking-wider mb-2 mt-6">Quản lý</p>

                    <button
                        onClick={() => onNavigate('products')}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors w-full text-left ${activePage === 'products'
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-sub hover:bg-gray-50 hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined" style={activePage === 'products' ? { fontVariationSettings: "'FILL' 1" } : {}}>inventory_2</span>
                        <span>Sản phẩm</span>
                    </button>

                    <button
                        onClick={() => onNavigate('orders')}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors w-full text-left ${activePage === 'orders'
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-sub hover:bg-gray-50 hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined" style={activePage === 'orders' ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_bag</span>
                        <span>Đơn hàng</span>
                    </button>

                    <button
                        onClick={() => onNavigate('coupons')}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors w-full text-left ${activePage === 'coupons'
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-sub hover:bg-gray-50 hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined" style={activePage === 'coupons' ? { fontVariationSettings: "'FILL' 1" } : {}}>local_offer</span>
                        <span>Khuyến mãi</span>
                    </button>

                    <button
                        onClick={() => onNavigate('customers')}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors w-full text-left ${activePage === 'customers'
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-sub hover:bg-gray-50 hover:text-text-main'
                            }`}
                    >
                        <span className="material-symbols-outlined" style={activePage === 'customers' ? { fontVariationSettings: "'FILL' 1" } : {}}>group</span>
                        <span>Khách hàng</span>
                    </button>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button
                            onClick={() => onNavigate('home')}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-sub hover:bg-gray-50 hover:text-text-main transition-colors w-full text-left group"
                        >
                            <span className="material-symbols-outlined group-hover:text-primary">logout</span>
                            <span>Về trang chủ</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 h-full flex flex-col min-h-0 overflow-hidden relative bg-[#f5f5f8]">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-text-sub hover:bg-gray-100 rounded-lg">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="hidden sm:flex items-center text-sm text-text-sub">
                            <span className="hover:text-primary cursor-pointer">Admin</span>
                            <span className="material-symbols-outlined text-[16px] mx-1">chevron_right</span>
                            <span className="font-medium text-text-main capitalize">{activePage}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center relative">
                            <span className="material-symbols-outlined absolute left-3 text-text-sub text-[20px]">search</span>
                            <input className="pl-10 pr-4 py-2 bg-background-light border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 text-text-main placeholder-text-sub outline-none" placeholder="Tìm kiếm..." type="text" />
                        </div>
                        <button className="relative p-2 text-text-sub hover:bg-gray-100 rounded-full transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-full pr-3 transition-colors">
                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">A</div>
                            <span className="text-sm font-medium text-text-main hidden lg:block">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
