import { Category, Product, Recommendation } from "./types";

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'Tất cả', icon: 'grid_view' },
  { id: 'laptop', name: 'Laptop', icon: 'laptop_mac' },
  { id: 'phone', name: 'Điện thoại', icon: 'smartphone' },
  { id: 'tablet', name: 'Tablet', icon: 'tablet_mac' },
  { id: 'audio', name: 'Âm thanh', icon: 'headphones' },
  { id: 'watch', name: 'Smartwatch', icon: 'watch' },
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    brand: 'Apple',
    name: 'MacBook Air M2 2023 13.6 inch',
    price: 26990000,
    originalPrice: 31000000,
    rating: 4.9,
    reviews: 128,
    image: '',
    discount: 15
  },
  {
    id: 2,
    brand: 'Samsung',
    name: 'Samsung Galaxy S24 Ultra 5G',
    price: 29990000,
    rating: 4.8,
    reviews: 85,
    image: '',
  },
  {
    id: 3,
    brand: 'Sony',
    name: 'Tai nghe Sony WH-1000XM5',
    price: 7490000,
    rating: 4.9,
    reviews: 342,
    image: '',
    isNew: true
  },
  {
    id: 4,
    brand: 'Apple',
    name: 'Apple Watch Series 9 GPS',
    price: 9590000,
    rating: 4.7,
    reviews: 56,
    image: '',
  }
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 101,
    name: 'Logitech G Pro X',
    description: 'Chuột Gaming siêu nhẹ',
    price: 2990000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCDG_ppfIERVbRglIIjdy8TAnDzQu966FBVUG0PMVozkQnc157Fc7zIGhs7DrfGVwD6osOgoHpjNAo73lvdTylpouzmedlinmTuJDx0IzlLnEY-fZT2tCsaEcYFAFyb0PQaaaa7BAy7ORozLuH9XzRwYRWf-MgyMWOHai0qs9GyyitCJFQ8utHOw3q0kFTqDQ143Pk4uHrQF_Fe0hhNt4H4fE9tNUSZ6u9eMekK_inbFO042HumrgQO8Lmsi2zwXx2hy0BetYC8IVs',
  },
  {
    id: 102,
    name: 'iPad Air 5 M1',
    description: 'Sáng tạo không giới hạn',
    price: 14590000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP6tWRpOMhmBi9uS_TIJ5prlaHw6t28E1sfZezSl6ChZcYm2B7tikwV6yKrgHviBwbt2rQcUkZ1wIzruxLYOWq80BzvsDf9zVtkUd7CSU3GgFlQjQBUZ8J3i_qfzV4rOlxgI6f6pttqvdxrsroLolVynj9KdKjgQ_1zL50Gcg9SFHUyBlSOQgqMa9lhgLykUufjsiVXeIZOQWqSUjWCkIZCuzSlggzKjsZz_BirrcG82tO4ASZryiiO8N-CtMqakraq9K4bxbIodOz',
  },
  {
    id: 103,
    name: 'Keychron K2 Pro',
    description: 'Bàn phím cơ Custom',
    price: 2190000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3R-IFGciLOruKM_RahVDHZ0dWYXGGrhrYIklP7CdYLsKR7qC-En1R-gyS5GTTkgwBaYsoxXrP-GJBM_EPSqCMBfea55cO2077GZr2652pwBoGQLKFfctpUjbkiMiPDQ94YoUo5dPbySY6q2cWMjEmHC3Du24Z8M_HK2rN1xkT1ep0j2sUrhCOwpS7amhszaSIW067zzndww7k14WsWlrp6PI8ej0jdXnko3DPe9ZFZMFNwLhnoTClSx6jr1_GmXxthrg6uFWqKXPy',
  }
];

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', '₫');
};