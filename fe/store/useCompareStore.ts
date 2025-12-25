import { create } from 'zustand';
import { Product } from '../types';

interface CompareState {
    items: Product[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    clear: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
    items: [],
    addItem: (product) => set((state) => {
        if (state.items.find((item) => item.id === product.id)) return state;
        if (state.items.length >= 3) {
            alert('Chỉ có thể so sánh tối đa 3 sản phẩm');
            return state;
        }
        return { items: [...state.items, product] };
    }),
    removeItem: (productId) => set((state) => ({
        items: state.items.filter((item) => item.id !== productId)
    })),
    clear: () => set({ items: [] }),
}));
