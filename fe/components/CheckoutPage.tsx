import React, { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import cartService from '../services/cart.service';
import addressService from '../services/address.service';
import { formatCurrency } from '../constants';
import checkoutService from '../services/checkout.service';
import { useAuthStore } from '../store/useAuthStore';

const CheckoutPage: React.FC<{ onBack: () => void; onComplete?: () => void }> = ({ onBack, onComplete }) => {
    const items = useCartStore((s) => s.items);
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const [coupon, setCoupon] = useState('');
    const [couponInfo, setCouponInfo] = useState<{ valid: boolean; discount?: number; finalTotal?: number; message?: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [phone, setPhone] = useState('');
    const [fullname, setFullname] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'ewallet'>('cod');

    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        if (user) setFullname(user.fullname || '');

        (async () => {
            try {
                const resp = await addressService.getMyAddresses();
                if (Array.isArray(resp)) {
                    setAddresses(resp);
                    if (resp.length > 0) {
                        setSelectedAddressId(resp[0].id);
                        setAddress(resp[0].full_address || resp[0].address || '');
                    }
                }
            } catch (e) {
                // ignore if address endpoint not available
            }
        })();
    }, [user]);

    const applyCoupon = async () => {
        if (!coupon) return alert('Nhập mã giảm giá');
        setLoading(true);
        try {
            const resp = await checkoutService.validateCoupon(coupon, subtotal);
            setCouponInfo({ valid: resp.valid, discount: resp.discount, finalTotal: resp.finalTotal, message: resp.message });
        } catch (err: any) {
            setCouponInfo({ valid: false, message: err?.message || 'Lỗi' });
        } finally {
            setLoading(false);
        }
    };

    const placeOrder = async () => {
        if (!fullname || !phone || !address) return alert('Vui lòng điền đầy đủ thông tin giao hàng');
        setLoading(true);
        try {
            const payload = {
                couponCode: couponInfo?.valid ? coupon : undefined,
                address_id: selectedAddressId ?? null,
                payment_method: paymentMethod,
                shipping_fee: 0,
            } as any;

            const resp = await checkoutService.checkout(payload);
            // resp.order
            if (paymentMethod !== 'cod' && resp?.order?.id) {
                // create payment for online methods
                await checkoutService.createPayment(resp.order.id, paymentMethod === 'card' ? 'card' : 'ewallet');
            }
            // clear cart in frontend & backend
            try {
                await cartService.clear();
            } catch (e) {
                // ignore
            }
            // refresh cart store
            try {
                await (useCartStore.getState().loadCart?.());
            } catch (e) {
                // ignore
            }

            alert('Đặt hàng thành công');
            if (onComplete) onComplete();
        } catch (err: any) {
            alert(err?.message || 'Không thể đặt hàng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200 font-display text-[#181811] dark:text-white">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 py-6 max-w-[1440px] mx-auto w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={onBack} className="text-sm text-[#6f6189] hover:text-primary">Trở lại</button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <h1 className="text-3xl font-black mb-2">Thanh toán</h1>
                            <p className="text-gray-500 mb-6">Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng.</p>

                            <section className="bg-white dark:bg-[#1f1a2e] rounded-xl p-6 mb-6">
                                <h2 className="font-bold text-lg mb-4">Thông tin giao hàng</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Họ và tên" className="form-input p-3 rounded-lg" />
                                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" className="form-input p-3 rounded-lg" />
                                    <input className="form-input p-3 rounded-lg md:col-span-2" value={user?.email || ''} readOnly />
                                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa chỉ chi tiết" className="form-input p-3 rounded-lg md:col-span-2" />
                                </div>
                            </section>

                            <section className="bg-white dark:bg-[#1f1a2e] rounded-xl p-6">
                                <h2 className="font-bold text-lg mb-4">Phương thức thanh toán</h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                        <input checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} type="radio" name="pm" />
                                        <div>
                                            <div className="font-bold">Thanh toán khi nhận hàng (COD)</div>
                                            <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi shipper giao hàng đến.</div>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                        <input checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} type="radio" name="pm" />
                                        <div>
                                            <div className="font-bold">Thẻ Tín dụng / Ghi nợ</div>
                                            <div className="text-sm text-gray-500">Visa, Mastercard, JCB.</div>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border ${paymentMethod === 'ewallet' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                        <input checked={paymentMethod === 'ewallet'} onChange={() => setPaymentMethod('ewallet')} type="radio" name="pm" />
                                        <div>
                                            <div className="font-bold">Ví điện tử</div>
                                            <div className="text-sm text-gray-500">Momo, ZaloPay ...</div>
                                        </div>
                                    </label>
                                </div>
                            </section>
                        </div>

                        <aside className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
                            <div className="bg-white dark:bg-[#1f1a2e] rounded-xl p-6 shadow-sm border border-transparent">
                                <h3 className="font-bold text-lg mb-4">Đơn hàng ({items.length} sản phẩm)</h3>
                                <div className="space-y-3 max-h-[240px] overflow-auto mb-4">
                                    {items.map((it) => (
                                        <div key={it.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden" style={{ backgroundImage: `url(${it.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                                <div>
                                                    <div className="font-medium">{it.name}</div>
                                                    <div className="text-sm text-gray-500">Số lượng: {it.quantity}</div>
                                                </div>
                                            </div>
                                            <div className="font-semibold">{formatCurrency(it.price * it.quantity)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    {addresses && addresses.length > 0 ? (
                                        <div className="mb-3">
                                            <label className="text-sm font-medium mb-2 block">Chọn địa chỉ</label>
                                            <select value={selectedAddressId ?? ''} onChange={(e) => { const v = e.target.value; setSelectedAddressId(v ? Number(v) : null); const a = addresses.find((x) => x.id === Number(v)); if (a) setAddress(a.full_address || a.address || ''); }} className="w-full p-2 rounded-lg">
                                                <option value="">-- Chọn địa chỉ --</option>
                                                {addresses.map((a) => (
                                                    <option key={a.id} value={a.id}>{a.label || a.full_name || a.address || `Địa chỉ ${a.id}`}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : null}
                                    <div className="flex gap-2">
                                        <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Mã giảm giá" className="flex-1 form-input p-3 rounded-lg" />
                                        <button onClick={applyCoupon} disabled={loading} className="px-4 rounded-lg bg-gray-100 hover:bg-gray-200">Áp dụng</button>
                                    </div>
                                    {couponInfo && (
                                        <div className={`mt-2 text-sm ${couponInfo.valid ? 'text-green-600' : 'text-red-600'}`}>{couponInfo.message}</div>
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm text-gray-600"><span>Tạm tính</span><span>{formatCurrency(subtotal)}</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>Phí vận chuyển</span><span className="text-green-600">Miễn phí</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>Giảm giá</span><span>-{formatCurrency(couponInfo?.discount || 0)}</span></div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 mb-4">
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold">Tổng cộng</span>
                                        <div className="text-2xl font-black text-primary tracking-tight">{formatCurrency((couponInfo?.finalTotal ?? subtotal))}</div>
                                    </div>
                                </div>

                                <button onClick={placeOrder} disabled={loading} className="w-full bg-primary text-white font-bold py-3 rounded-lg">{loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}</button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
