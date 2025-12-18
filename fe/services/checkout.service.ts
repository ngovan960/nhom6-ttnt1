import axiosClient from "../lib/axios";

export const checkoutService = {
  validateCoupon: async (code: string, cartTotal: number) => {
    const res = await axiosClient.post('/coupons/validate', { code, cartTotal });
    return res;
  },

  checkout: async (payload: { couponCode?: string; address_id?: number | null; payment_method: string; shipping_fee?: number }) => {
    const res = await axiosClient.post('/checkout', payload);
    return res;
  },

  createPayment: async (orderId: number, method: string) => {
    const res = await axiosClient.post('/payments/create', { order_id: orderId, method });
    return res;
  }
};

export default checkoutService;
