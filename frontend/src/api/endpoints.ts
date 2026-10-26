import client from './client';
import type {
  AdminProductFormData,
  AuthTokens,
  Cart,
  Category,
  Order,
  PaginatedResponse,
  Product,
  ShowcaseSlotFormState,
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

export const getAdminProducts = (params?: {
  search?: string;
  category?: string;
  filter?: string;
  page?: number;
}) =>
  client.get<PaginatedResponse<Product>>('/admin/products/', { params }).then((r) => r.data);

type BuildFormOptions = {
  /** Do not attach any showcase image files (metadata-only save). */
  skipShowcaseUploads?: boolean;
  /** Only attach this showcase slot file (single-image request for VPS/nginx limits). */
  onlyShowcaseSlot?: string;
};

function buildAdminProductFormData(data: AdminProductFormData, options: BuildFormOptions = {}): FormData {
  const formData = new FormData();
  formData.append('name', data.name);
  if (data.slug) formData.append('slug', data.slug);
  formData.append('description', data.description);
  formData.append('price', String(data.price));
  formData.append('category', String(data.category));
  formData.append('stock', String(data.stock));
  formData.append('featured', String(data.featured));
  formData.append('deleted_image_ids', JSON.stringify(data.deletedImageIds));

  const clearedSlots = Object.entries(data.showcaseSlots)
    .filter(([, slot]) => slot.clearExisting && slot.existingImageId)
    .map(([key]) => key);
  formData.append('cleared_showcase_slots', JSON.stringify(clearedSlots));

  if (!options.skipShowcaseUploads) {
    Object.entries(data.showcaseSlots).forEach(([slotKey, slot]) => {
      if (!slot.pendingFile) return;
      if (options.onlyShowcaseSlot && options.onlyShowcaseSlot !== slotKey) return;
      formData.append(`showcase_${slotKey}`, slot.pendingFile);
    });
  }

  if (data.primaryShowcaseSlot) {
    formData.append('primary_showcase_slot', data.primaryShowcaseSlot);
  }

  const primaryExisting = data.existingImages.find((image) => image.isPrimary);
  const primaryNewIndex = data.newImages.findIndex((image) => image.isPrimary);

  if (primaryExisting) {
    formData.append('primary_image_id', String(primaryExisting.id));
  } else if (primaryNewIndex >= 0) {
    formData.append('primary_new_image_index', String(primaryNewIndex));
  }

  if (!options.onlyShowcaseSlot) {
    data.newImages.forEach((image) => {
      formData.append('new_images', image.file);
    });
  }

  return formData;
}

function getPendingShowcaseEntries(
  data: AdminProductFormData,
): [string, ShowcaseSlotFormState][] {
  return Object.entries(data.showcaseSlots).filter(([, slot]) => Boolean(slot.pendingFile));
}

export const createAdminProduct = (data: AdminProductFormData, options?: BuildFormOptions) =>
  client
    .post<Product>('/admin/products/', buildAdminProductFormData(data, options))
    .then((r) => r.data);

export const updateAdminProduct = (
  id: number,
  data: AdminProductFormData,
  options?: BuildFormOptions,
) =>
  client
    .patch<Product>(`/admin/products/${id}/`, buildAdminProductFormData(data, options))
    .then((r) => r.data);

export async function uploadAdminProductShowcaseSlot(
  productId: number,
  data: AdminProductFormData,
  slotKey: string,
): Promise<Product> {
  return updateAdminProduct(productId, data, { onlyShowcaseSlot: slotKey, skipShowcaseUploads: false });
}

/**
 * Saves product metadata once, then uploads each new showcase image in its own request
 * so large multi-image saves work even when nginx client_max_body_size is ~1MB.
 */
export async function saveAdminProduct(
  data: AdminProductFormData,
  editingId: number | null,
  onProgress?: (current: number, total: number) => void,
): Promise<Product> {
  const pending = getPendingShowcaseEntries(data);
  const totalUploads = pending.length;
  let uploadIndex = 0;

  const report = () => {
    if (onProgress && totalUploads > 0) {
      onProgress(uploadIndex, totalUploads);
    }
  };

  if (editingId) {
    let product = await updateAdminProduct(editingId, data, { skipShowcaseUploads: true });
    for (const [slotKey] of pending) {
      uploadIndex += 1;
      report();
      product = await uploadAdminProductShowcaseSlot(editingId, data, slotKey);
    }
    return product;
  }

  if (pending.length === 0) {
    return createAdminProduct(data);
  }

  const [firstSlot] = pending[0];
  uploadIndex = 1;
  report();
  let product = await createAdminProduct(data, { onlyShowcaseSlot: firstSlot });

  for (let i = 1; i < pending.length; i++) {
    const [slotKey] = pending[i];
    uploadIndex = i + 1;
    report();
    product = await uploadAdminProductShowcaseSlot(product.id, data, slotKey);
  }

  return product;
}

export const deleteAdminProduct = (id: number) =>
  client.delete(`/admin/products/${id}/`);
