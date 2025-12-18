import axiosClient from '../lib/axios';

export const cartService = {
  addItem: async (productId: number, quantity = 1) => {
    const res = await axiosClient.post('/cart/items', { productId, quantity });
    // after adding, fetch latest cart so callers receive updated state
    try {
      const cart = await axiosClient.get('/cart');
      return cart;
    } catch (err) {
      // return original response when get fails
      return res;
    }
  },

  getCart: async () => {
    const res = await axiosClient.get('/cart');
    return res;
  },

  updateItem: async (productId: number, action: 'decrease') => {
    const res = await axiosClient.put(`/cart/items/${productId}`, { action });
    return res;
  },

  removeItem: async (productId: number) => {
    const res = await axiosClient.delete(`/cart/items/${productId}`);
    return res;
  },

  clear: async () => {
    const res = await axiosClient.delete('/cart/clear');
    return res;
  },
};

export default cartService;
