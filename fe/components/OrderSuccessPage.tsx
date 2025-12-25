import React from 'react';

interface OrderSuccessPageProps {
    onContinue: () => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ onContinue }) => {
    return (
        <div className="flex-grow w-full max-w-7xl mx-auto px-4 lg:px-10 py-8 lg:py-12">
            <div className="flex flex-col items-center justify-center text-center mb-12 animate-fade-in-up">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform scale-150"></div>
                    <div className="relative bg-white dark:bg-[#1a1a2e] rounded-full p-4 shadow-lg">
                        <span className="material-symbols-outlined text-6xl text-primary font-bold">check_circle</span>
                    </div>
                </div>
                <h1 className="text-[#111118] dark:text-white tracking-tight text-3xl lg:text-4xl font-bold leading-tight px-4 pb-3">Đặt hàng thành công!</h1>
                <p className="text-gray-600 dark:text-gray-300 text-base max-w-lg mx-auto mb-2">Cảm ơn bạn đã tin tưởng TechShop. Đơn hàng của bạn đã được ghi nhận và đang được xử lý.</p>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onContinue}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                    >
                        <span>Tiếp tục mua sắm</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-gray-100 text-[#111118] font-bold py-3 px-8 rounded-lg border border-gray-200 transition-colors">
                        Xem chi tiết đơn hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
