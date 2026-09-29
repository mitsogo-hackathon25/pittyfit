export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  order: number;
  product_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  category_name: string;
  category_slug: string;
  featured: boolean;
  image: string;
  stock: number;
  description?: string;
  images?: ProductImage[];
}

export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: string;
  item_count: number;
}

export interface Testimonial {
  id: number;
  name: string;
  avatar_url: string;
  quote: string;
  rating: number;
}

export interface Order {
  id: number;
  status: string;
  total: string;
  shipping_name: string;
  shipping_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile?: Profile;
}

export interface Profile {
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
