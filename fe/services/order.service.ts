import axiosClient from "../lib/axios";

export interface Order {
    id: number;
    user_id: number;
    address_id: number;
    coupon_id: number | null;
    total_price: string;
    shipping_fee: string;
    payment_method: string;
    status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    OrderItems?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: string;
    Product: {
        id: number;
        name: string;
        price: string;
        image?: string;
    };
}

export const orderService = {
    getMyOrders: async (): Promise<{ orders: Order[] }> => {
        const res = await axiosClient.get<{ orders: Order[] }>("/orders/orders");
        return res as unknown as { orders: Order[] };
    },
};
