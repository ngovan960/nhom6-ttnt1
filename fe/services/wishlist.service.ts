import axiosClient from "../lib/axios";
import { Product } from "../types";

export interface WishlistItem {
    user_id: number;
    product_id: number;
    createdAt: string;
    updatedAt: string;
    Product: Product;
}

export const wishlistService = {
    getWishlist: async (userId: number): Promise<{ data: WishlistItem[] }> => {
        const res = await axiosClient.get<{ data: WishlistItem[] }>(`/wishlist/wishlist?user_id=${userId}`);
        return res as unknown as { data: WishlistItem[] };
    },
    addToWishlist: async (productId: number, userId: number): Promise<{ data: WishlistItem }> => {
        const res = await axiosClient.post<{ data: WishlistItem }>(`/wishlist/wishlist/${productId}`, { user_id: userId });
        return res as unknown as { data: WishlistItem };
    },
    removeFromWishlist: async (productId: number, userId: number): Promise<{ data: { removed: boolean } }> => {
        const res = await axiosClient.delete<{ data: { removed: boolean } }>(`/wishlist/wishlist/${productId}?user_id=${userId}`);
        return res as unknown as { data: { removed: boolean } };
    },
};
