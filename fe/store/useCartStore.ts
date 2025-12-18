import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import cartService from '../services/cart.service';

export interface CartItemState {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock?: number;
}

interface CartStore {
  items: CartItemState[];
  loading: boolean;
  loadCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateItem: (productId: number, action: 'decrease') => Promise<void>;
  clear: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loading: false,
  loadCart: async () => {
    set({ loading: true });
    try {
      const res = await cartService.getCart();
      const list = (res && (res as any).items) ? (res as any).items : [];
      const mapped = list.map((it: any) => ({
        id: it._id,
        name: it.name,
        price: it.discountedPrice ?? it.regularPrice ?? 0,
        image: (it.images && it.images.length) ? it.images[0] : it.thumbnail || '',
        quantity: it.quantity,
        stock: it.stock,
      }));
      set({ items: mapped });
    } catch (err) {
      console.error('loadCart error', err);
    } finally {
      set({ loading: false });
    }
  },
  addItem: async (productId: number, quantity = 1) => {
    try {
      await cartService.addItem(productId, quantity);
      await get().loadCart();
    } catch (err) {
      throw err;
    }
  },
  removeItem: async (productId: number) => {
    try {
      await cartService.removeItem(productId);
      set({ items: get().items.filter(i => i.id !== productId) });
    } catch (err) {
      throw err;
    }
  },
  updateItem: async (productId: number, action: 'decrease') => {
    try {
      await cartService.updateItem(productId, action);
      await get().loadCart();
    } catch (err) {
      throw err;
    }
  },
  clear: async () => {
    try {
      await cartService.clear();
      set({ items: [] });
    } catch (err) {
      throw err;
    }
  }
}));

export default useCartStore;
