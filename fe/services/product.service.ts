import axiosClient from '../lib/axios';
import { Product } from '../types';
import { CATEGORIES } from '../constants';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    // call backend where products are mounted; using absolute URL to avoid baseURL mismatch
    const res = await axiosClient.get<{ data: any[] }>('http://localhost:3001/api/products');
    // axiosClient returns response.data, which here is { data: any[] }
    const items = (res as any).data as any[];
    const mapped = items.map((p) => {
      const firstImage = p.images && p.images.length ? p.images[0].image_url || p.images[0].url : undefined;
      return {
        id: p.id,
        name: p.name || p.title || p.fullname || p.brand || 'Untitled',
        brand: p.brand || p.manufacturer || '',
        price: p.price ?? p.sale_price ?? 0,
        originalPrice: p.originalPrice ?? p.list_price ?? undefined,
        rating: p.rating ?? 4.5,
        reviews: p.reviews ?? 0,
        image: firstImage || p.image || '',
        images: (p.images && p.images.length) ? p.images.map((img: any) => img.image_url || img.url).filter(Boolean) : (p.image ? [p.image] : []),
        isNew: !!p.isNew,
        discount: p.discount ?? undefined,
      } as Product;
    });

    // return first 50
    return mapped.slice(0, 50);
  },
  getByCategory: async (categoryId: string | number): Promise<Product[]> => {
    const res = await axiosClient.get<{ data: any[] }>(`http://localhost:3001/api/products/category/${categoryId}`);
    const items = (res as any).data as any[];
    const mapped = items.map((p) => {
      const firstImage = p.images && p.images.length ? p.images[0].image_url || p.images[0].url : undefined;
      return {
        id: p.id,
        name: p.name || p.title || p.fullname || p.brand || 'Untitled',
        brand: p.brand || p.manufacturer || '',
        price: p.price ?? p.sale_price ?? 0,
        originalPrice: p.originalPrice ?? p.list_price ?? undefined,
        rating: p.rating ?? 4.5,
        reviews: p.reviews ?? 0,
        image: firstImage || p.image || '',
        images: (p.images && p.images.length) ? p.images.map((img: any) => img.image_url || img.url).filter(Boolean) : (p.image ? [p.image] : []),
        isNew: !!p.isNew,
        discount: p.discount ?? undefined,
      } as Product;
    });

    return mapped.slice(0, 50);
  },
  search: async (q: string): Promise<{ total: number; products: Product[] }> => {
    const res = await axiosClient.get(`http://localhost:3001/api/search?q=${encodeURIComponent(q)}`);
    // try to read products array from common response shapes
    const body = (res as any) || {};
    const items = (body.data && body.data.products) || body.products || body.data || [];
    const mapped = (items as any[]).map((p) => {
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
      } as Product;
    });

    let total = (body.data && body.data.total) || body.total || mapped.length;

    // If backend returned no products, try matching the query to a local category and return that category's products
    if ((!mapped || mapped.length === 0) && q && typeof q === 'string') {
      const qNorm = q.trim().toLowerCase();
      const matched = CATEGORIES.find((c) => {
        const name = (c.name || '').toString().toLowerCase();
        const id = (c.id || '').toString().toLowerCase();
        return name === qNorm || id === qNorm || name.includes(qNorm) || id === qNorm;
      });

      if (matched) {
        try {
          const catProducts = await (module.exports && module.exports.productService ? (module.exports.productService as any).getByCategory(matched.id) : null);
        } catch (e) {
          // ignore
        }
        // call local getByCategory implementation
        const catProds = await (productService as any).getByCategory?.(matched.id as any).catch(() => []);
        const list = (catProds as Product[]) || [];
        total = list.length;
        return { total, products: list };
      }
    }

    return { total, products: mapped };
  },
  suggest: async (q: string): Promise<{ keywords: string[]; products: Product[]; categories: any[] }> => {
    const res = await axiosClient.get(`http://localhost:3001/api/search/suggest?q=${encodeURIComponent(q)}`);
    const body = (res as any) || {};
    // Expect shapes like { keywords: [], products: [], categories: [] } or { data: { keywords, products } }
    const keywords = (body.data && body.data.keywords) || body.keywords || [];
    const items = (body.data && body.data.products) || body.products || [];
    const cats = (body.data && body.data.categories) || body.categories || [];
    const mappedProducts = (items as any[]).map((p) => {
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
      } as Product;
    });

    return { keywords, products: mappedProducts, categories: cats };
  }
};
