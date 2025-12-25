import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../constants';
import { useCompareStore } from '@/store/useCompareStore';
import axiosClient from '../lib/axios';

const AIComparisonPage: React.FC = () => {
  const { items, removeItem, clear } = useCompareStore();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length >= 2) {
      fetchAnalysis();
    } else {
      setAnalysis(null);
    }
  }, [items]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp: any = await axiosClient.post('/ai/compare', {
        productIds: items.map(i => i.id)
      });
      // axiosClient interceptor returns data directly
      setAnalysis(resp.analysis || resp);
    } catch (err: any) {
      console.error('Failed to fetch AI analysis', err);
      const msg = err?.response?.data?.message || err.message || 'Lỗi không xác định';
      setError(`Lỗi kết nối AI: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length < 2) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 bg-[#f9f8fc] dark:bg-[#131022] min-h-screen transition-colors">
        <div className="bg-white dark:bg-[#1e1b2e] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-primary font-variation-filled">compare_arrows</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Chọn thêm sản phẩm</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Vui lòng chọn ít nhất 2 sản phẩm để bắt đầu so sánh thông minh bằng AI.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-primary text-[#181811] font-bold rounded-xl shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
          >
            Quay lại cửa hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-space text-[#100d1c] dark:text-white bg-[#f9f8fc] dark:bg-[#131022] min-h-screen transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">So sánh thông minh</h2>
            <div className="flex items-center gap-2 text-[#330df2] text-sm font-medium bg-[#330df2]/5 w-fit px-3 py-1 rounded-full border border-[#330df2]/10">
              <span className="material-symbols-outlined text-lg animate-pulse">auto_awesome</span>
              <span>Được hỗ trợ bởi Gemini AI Analysis</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={clear} className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:text-red-600 font-bold transition-all text-sm">Xóa tất cả</button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#330df2] hover:bg-[#2309a8] text-white text-sm font-bold shadow-lg shadow-[#330df2]/30 transition-all">
              <span className="material-symbols-outlined text-lg">share</span>
              Chia sẻ kết quả
            </button>
          </div>
        </div>

        {/* AI Insight Section */}
        <section className={`mb-12 relative overflow-hidden rounded-2xl border transition-all duration-500 ${loading ? 'opacity-60 grayscale' : 'opacity-100'} ${analysis ? 'bg-gradient-to-br from-[#f0f4ff] to-[#fdfbf7] dark:from-[#1a1633] dark:to-[#1e1b2e] border-[#330df2]/10' : 'bg-gray-50 border-dashed border-gray-300'}`}>
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-[2px]">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-primary animate-pulse">AI đang phân tích dữ liệu...</p>
            </div>
          )}

          <div className="p-6 md:p-8 relative z-10">
            {analysis ? (
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-gradient-to-r from-[#330df2] to-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">AI Verdict</span>
                    <span className="text-gray-500 text-sm">Phân tích chuyên sâu từ đặc tính kỹ thuật</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {analysis.verdict}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
                    {analysis.reasoning}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {analysis.highlights?.map((h: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-[#1e1b2e]/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className={`flex items-center gap-2 mb-2 ${h.color === 'green' ? 'text-green-600' : h.color === 'orange' ? 'text-orange-500' : 'text-[#330df2]'}`}>
                          <span className="material-symbols-outlined">{h.icon || 'bolt'}</span>
                          <span className="font-bold text-sm">{h.title}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{h.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-80 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/50 dark:border-white/10">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">recommend</span>
                    Đề xuất tốt nhất
                  </h4>
                  <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 mb-4">
                    <p className="text-sm font-bold text-primary">{analysis.recommendation}</p>
                  </div>
                  <button className="w-full py-3 bg-[#330df2] text-white rounded-xl font-bold hover:bg-[#2309a8] transition-colors shadow-lg shadow-[#330df2]/20">
                    Đặt mua ngay
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                {!loading && error && (
                  <div className="text-red-500 mb-4 flex flex-col items-center">
                    <span className="material-symbols-outlined text-5xl mb-2">error</span>
                    <p className="font-bold">{error}</p>
                    <button onClick={fetchAnalysis} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-sm">Thử lại</button>
                  </div>
                )}
                {!loading && !error && (
                  <div className="text-gray-400">
                    <span className="material-symbols-outlined text-6xl mb-4">auto_awesome</span>
                    <p className="text-lg">Bắt đầu so sánh để nhận phân tích từ AI</p>
                    <button onClick={fetchAnalysis} className="mt-4 px-6 py-2.5 bg-primary text-[#181811] font-bold rounded-xl">Phân tích ngay</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Product Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(product => (
            <div key={product.id} className="bg-white dark:bg-[#1e1b2e] rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm relative group">
              <button
                onClick={() => removeItem(product.id)}
                className="absolute top-3 right-3 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
              <div className="h-48 flex items-center justify-center mb-6">
                <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-primary uppercase">{product.brand}</p>
                <h3 className="font-bold text-lg line-clamp-2 h-14">{product.name}</h3>
                <p className="text-2xl font-black text-[#100d1c] dark:text-white">{formatCurrency(product.price)}</p>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Cấu hình tóm tắt:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4 leading-relaxed italic">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {items.length < 3 && (
            <button
              onClick={() => window.location.href = '/'}
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                <span className="material-symbols-outlined text-2xl">add</span>
              </div>
              <span className="font-bold text-gray-500 group-hover:text-primary">Thêm sản phẩm</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AIComparisonPage;