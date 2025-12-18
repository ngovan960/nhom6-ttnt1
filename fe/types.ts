export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  isNew?: boolean;
  discount?: number;
  description?: string;
}

export interface Recommendation {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}