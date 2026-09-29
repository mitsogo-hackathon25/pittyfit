import client from './client';
import type {
  AuthTokens,
  Cart,
  Category,
  Order,
  PaginatedResponse,
  Product,
  Testimonial,
  User,
} from './types';

export const getCategories = () =>
  client.get<PaginatedResponse<Category> | Category[]>('/categories/').then((r) =>
    Array.isArray(r.data) ? r.data : r.data.results,
  );

export const getProducts = (params?: { category?: string; search?: string; featured?: boolean }) =>
  client.get<PaginatedResponse<Product>>('/products/', { params }).then((r) => r.data);

export const getProduct = (slug: string) =>
  client.get<Product>(`/products/${slug}/`).then((r) => r.data);

export const getTestimonials = () =>
  client.get<PaginatedResponse<Testimonial> | Testimonial[]>('/testimonials/').then((r) =>
    Array.isArray(r.data) ? r.data : r.data.results,
  );

export const getCart = () =>
  client.get<Cart>('/cart/').then((r) => r.data);

export const addToCart = (productId: number, quantity = 1) =>
  client.post<Cart>('/cart/add/', { product_id: productId, quantity }).then((r) => r.data);

export const updateCartItem = (itemId: number, quantity: number) =>
  client.patch<Cart>(`/cart/items/${itemId}/`, { quantity }).then((r) => r.data);

export const removeCartItem = (itemId: number) =>
  client.delete<Cart>(`/cart/items/${itemId}/`).then((r) => r.data);

export const login = (email: string, password: string) =>
  client.post<AuthTokens>('/auth/login/', { username: email, password }).then((r) => r.data);

export const register = (data: {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}) => client.post<User>('/auth/register/', data).then((r) => r.data);

export const getProfile = () =>
  client.get<{ user: User; profile: User['profile'] }>('/auth/profile/').then((r) => r.data);

export const updateProfile = (data: Record<string, string>) =>
  client.patch('/auth/profile/', data).then((r) => r.data);

export const getOrders = () =>
  client.get<Order[]>('/orders/').then((r) => r.data);

export const createCheckout = (shipping: {
  shipping_name: string;
  shipping_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
}) => client.post<{ checkout_url: string; order_id: number; demo_mode?: boolean }>(
  '/orders/create-checkout/',
  shipping,
).then((r) => r.data);

export const subscribeNewsletter = (email: string) =>
  client.post('/newsletter/subscribe/', { email }).then((r) => r.data);
