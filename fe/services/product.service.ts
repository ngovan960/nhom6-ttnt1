import axiosClient from '../lib/axios';

export const backendApi = axiosClient;
import { Product } from '../types';
import { CATEGORIES } from '../constants';

const mapProduct = (p: any): Product => {
  const firstImage = p.images && p.images.length ? p.images[0].image_url || p.images[0].url : undefined;
  return {
    id: p.id || p._id || p.productId,
    name: p.name || p.title || p.fullname || p.brand || 'Untitled',
    brand: p.brand || p.manufacturer || '',
    price: p.price ?? p.sale_price ?? p.regularPrice ?? 0,
    originalPrice: p.originalPrice ?? p.list_price ?? p.originalPrice ?? undefined,
    rating: p.rating ?? 4.5,
    reviews: p.reviews ?? p.reviewCount ?? 0,
    image: firstImage || p.image || p.thumbnail || '',
    images: (p.images && p.images.length) ? p.images.map((img: any) => img.image_url || img.url).filter(Boolean) : (p.image ? [p.image] : []),
    isNew: !!p.isNew,
    discount: p.discount ?? undefined,
    description: p.description
  } as Product;
};

const mapProducts = (items: any[]): Product[] => items.map(mapProduct);

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const res = await axiosClient.get<{ data: any[] }>('/products');
    const items = (res as any).data as any[];
    return mapProducts(items).slice(0, 50);
  },
  getById: async (id: number | string): Promise<Product | null> => {
    try {
      const res = await axiosClient.get<{ data: any }>(`/products/${id}`);
      const item = (res as any).data;
      return mapProduct(item);
    } catch (e) {
      return null;
    }
  },
  getByCategory: async (categoryId: string | number): Promise<Product[]> => {
    const res = await axiosClient.get<{ data: any[] }>(`/products/category/${categoryId}`);
    const items = (res as any).data as any[];
    return mapProducts(items).slice(0, 50);
  },
  search: async (q: string): Promise<{ total: number; products: Product[] }> => {
    const res = await axiosClient.get(`/search?q=${encodeURIComponent(q)}`);
    const body = (res as any) || {};
    const items = (body.data && body.data.products) || body.products || body.data || [];
    const mapped = mapProducts(items);

    let total = (body.data && body.data.total) || body.total || mapped.length;

    if ((!mapped || mapped.length === 0) && q && typeof q === 'string') {
      const qNorm = q.trim().toLowerCase();
      const matched = CATEGORIES.find((c) => {
        const name = (c.name || '').toString().toLowerCase();
        const id = (c.id || '').toString().toLowerCase();
        return name === qNorm || id === qNorm || name.includes(qNorm) || id === qNorm;
      });

      if (matched) {
        try {
          // Recursive call for category fallback
          const catProds = await (productService as any).getByCategory(matched.id).catch(() => []);
          const list = (catProds as Product[]) || [];
          total = list.length;
          return { total, products: list };
        } catch (e) {
          // ignore
        }
      }
    }

    return { total, products: mapped };
  },
  suggest: async (q: string): Promise<{ keywords: string[]; products: Product[]; categories: any[] }> => {
    const res = await axiosClient.get(`/search/suggest?q=${encodeURIComponent(q)}`);
    const body = (res as any) || {};
    const keywords = (body.data && body.data.keywords) || body.keywords || [];
    const items = (body.data && body.data.products) || body.products || [];
    const cats = (body.data && body.data.categories) || body.categories || [];
    const mappedProducts = mapProducts(items);

    return { keywords, products: mappedProducts, categories: cats };
  },

  getCategories: async (): Promise<any[]> => {
    const res = await axiosClient.get<{ data: any[] }>('/categories');
    const items = (res as any).data || (Array.isArray(res) ? res : []);
    return items.map((c: any) => ({
      id: c.id,
      name: c.name,
      icon: c.description || 'category'
    }));
  },

  getAdminProducts: async (): Promise<any[]> => {
    const res = await axiosClient.get('/products');
    return (res as any).data || res;
  }
};
