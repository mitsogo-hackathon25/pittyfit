import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../api/errors';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  getCategories,
  updateAdminProduct,
} from '../api/endpoints';
import type { AdminProductFormData, Category, Product, ShowcaseSlotFormState } from '../api/types';
import AdminShowcaseSections from '../components/AdminShowcaseSections';
import Button from '../components/Button';
import { createEmptyShowcaseSlotState } from '../constants/showcaseSlots';
import { compressImageFile, compressOptionsForShowcaseSlot } from '../utils/compressImage';

const ADMIN_PAGE_SIZE = 25;

function createEmptyForm(categoryId = 0): AdminProductFormData {
  return {
    name: '',
    slug: '',
    description: '',
    price: '',
    category: categoryId,
    stock: 100,
    featured: false,
    showcaseSlots: createEmptyShowcaseSlotState(),
    primaryShowcaseSlot: 'model_0',
    existingImages: [],
    newImages: [],
    deletedImageIds: [],
  };
}

function revokePreviewUrls(images: AdminProductFormData['newImages']) {
  images.forEach((image) => URL.revokeObjectURL(image.preview));
}

function revokeShowcasePreviews(slots: Record<string, ShowcaseSlotFormState>) {
  Object.values(slots).forEach((slot) => {
    if (slot.pendingFile && slot.preview?.startsWith('blob:')) {
      URL.revokeObjectURL(slot.preview);
    }
  });
}

function hasFilledShowcaseSlot(slots: Record<string, ShowcaseSlotFormState>) {
  return Object.values(slots).some(
    (slot) => Boolean(slot.pendingFile) || Boolean(slot.preview && !slot.clearExisting),
  );
}

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AdminProductFormData>(() => createEmptyForm());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [compressingSlot, setCompressingSlot] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, productFilter]);

  useEffect(() => {
    getCategories()
      .then((categoryData) => {
        setCategories(categoryData);
        setForm((prev) => ({
          ...prev,
          category: prev.category || categoryData[0]?.id || 0,
        }));
      })
      .catch(() => setError('Failed to load categories.'));
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productData = await getAdminProducts({
        search: search || undefined,
        category: categoryFilter || undefined,
        filter: productFilter || undefined,
        page,
      });
      setProducts(productData.results);
      setTotalCount(productData.count);
      setError('');
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, productFilter, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const closeForm = () => {
    revokePreviewUrls(form.newImages);
    revokeShowcasePreviews(form.showcaseSlots);
    setShowForm(false);
    setEditingId(null);
    setForm(createEmptyForm(categories[0]?.id ?? 0));
    setError('');
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(createEmptyForm(categories[0]?.id ?? 0));
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const startEdit = (product: Product) => {
    revokePreviewUrls(form.newImages);
    revokeShowcasePreviews(form.showcaseSlots);
    setEditingId(product.id);

    const showcaseSlots = createEmptyShowcaseSlotState();
    let primaryShowcaseSlot = 'model_0';
    const existingImages: AdminProductFormData['existingImages'] = [];

    product.images?.forEach((img) => {
      if (img.showcase_slot && showcaseSlots[img.showcase_slot]) {
        showcaseSlots[img.showcase_slot] = {
          existingImageId: img.id,
          preview: img.image,
          clearExisting: false,
        };
        if (img.is_primary) {
          primaryShowcaseSlot = img.showcase_slot;
        }
      } else {
        existingImages.push({
          id: img.id,
          preview: img.image,
          isPrimary: img.is_primary,
        });
      }
    });

    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price,
      category: product.category ?? categories[0]?.id ?? 0,
      stock: product.stock,
      featured: product.featured,
      showcaseSlots,
      primaryShowcaseSlot,
      existingImages,
      newImages: [],
      deletedImageIds: [],
    });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const applyShowcaseFile = (slotKey: string, file: File) => {
    setForm((prev) => {
      const current = prev.showcaseSlots[slotKey];
      if (current?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(current.preview);
      }

      const showcaseSlots = {
        ...prev.showcaseSlots,
        [slotKey]: {
          existingImageId: current?.existingImageId,
          preview: URL.createObjectURL(file),
          pendingFile: file,
          clearExisting: false,
        },
      };

      const hasPrimary = Object.entries(showcaseSlots).some(([key, slot]) => {
        if (key !== prev.primaryShowcaseSlot) return false;
        return Boolean(slot.pendingFile) || Boolean(slot.preview && !slot.clearExisting);
      });

      return {
        ...prev,
        showcaseSlots,
        primaryShowcaseSlot: hasPrimary ? prev.primaryShowcaseSlot : slotKey,
      };
    });
  };

  const handleShowcaseUpload = async (slotKey: string, file: File) => {
    setCompressingSlot(slotKey);
    setError('');
    try {
      const compressed = await compressImageFile(file, compressOptionsForShowcaseSlot(slotKey));
      applyShowcaseFile(slotKey, compressed);
    } catch {
      setError('Could not process that image. Try another JPG or PNG.');
    } finally {
      setCompressingSlot(null);
    }
  };

  async function compressPendingShowcaseFiles(
    data: AdminProductFormData,
  ): Promise<AdminProductFormData> {
    const showcaseSlots = { ...data.showcaseSlots };
    for (const [slotKey, slot] of Object.entries(showcaseSlots)) {
      if (!slot.pendingFile) continue;
      showcaseSlots[slotKey] = {
        ...slot,
        pendingFile: await compressImageFile(
          slot.pendingFile,
          compressOptionsForShowcaseSlot(slotKey),
        ),
      };
    }
    return { ...data, showcaseSlots };
  }

  const handleShowcaseClear = (slotKey: string) => {
    setForm((prev) => {
      const current = prev.showcaseSlots[slotKey];
      if (current?.preview?.startsWith('blob:')) {
        URL.revokeObjectURL(current.preview);
      }

      const showcaseSlots = {
        ...prev.showcaseSlots,
        [slotKey]: {
          existingImageId: current?.existingImageId,
          preview: null,
          pendingFile: undefined,
          clearExisting: Boolean(current?.existingImageId),
        },
      };

      return { ...prev, showcaseSlots };
    });
  };

  const removeExistingImage = (imageId: number) => {
    setForm((prev) => {
      const removed = prev.existingImages.find((image) => image.id === imageId);
      const remaining = prev.existingImages.filter((image) => image.id !== imageId);
      const deletedImageIds = imageId > 0
        ? [...prev.deletedImageIds, imageId]
        : prev.deletedImageIds;

      if (removed?.isPrimary && remaining.length > 0) {
        remaining[0].isPrimary = true;
      }

      return {
        ...prev,
        existingImages: remaining,
        deletedImageIds,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    let payload: AdminProductFormData = {
      ...form,
      price: Number(form.price),
    };

    try {
      payload = await compressPendingShowcaseFiles(payload);
    } catch {
      setError('Could not prepare images for upload. Try smaller files.');
      setSaving(false);
      return;
    }

    const pendingBytes = Object.values(payload.showcaseSlots).reduce(
      (sum, slot) => sum + (slot.pendingFile?.size ?? 0),
      0,
    );
    if (pendingBytes > 2_500_000) {
      setError(
        'Total upload is still over 2.5MB after compression. Save one section at a time (model → save → edit → detail → save), or raise nginx client_max_body_size to 50M on the VPS.',
      );
      setSaving(false);
      return;
    }

    if (!payload.name.trim()) {
      setError('Product name is required.');
      setSaving(false);
      return;
    }
    if (!payload.category) {
      setError('Please select a category.');
      setSaving(false);
      return;
    }
    const hasShowcase = hasFilledShowcaseSlot(payload.showcaseSlots);
    const hasLegacyImages = payload.existingImages.length > 0 || payload.newImages.length > 0;
    if (!hasShowcase && !hasLegacyImages) {
      setError('Upload at least one image in the showcase sections below.');
      setSaving(false);
      return;
    }

    try {
      if (editingId) {
        await updateAdminProduct(editingId, payload);
        setSuccess('Product updated successfully.');
      } else {
        await createAdminProduct(payload);
        setSuccess('Product created successfully.');
      }
      closeForm();
      await loadProducts();
    } catch (err) {
      setError(
        getApiErrorMessage(err, 'Failed to save product. Check your inputs and try again.'),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    try {
      await deleteAdminProduct(product.id);
      setSuccess('Product deleted.');
      if (editingId === product.id) closeForm();
      await loadProducts();
    } catch {
      setError('Failed to delete product.');
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * ADMIN_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * ADMIN_PAGE_SIZE, totalCount);

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategoryFilter('');
    setProductFilter('');
    setPage(1);
  };

  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-2">Dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Product Admin
            </h1>
          </div>
          <Button onClick={openAddForm} variant="ghost">
            <Plus size={14} />
            Add New Product
          </Button>
        </div>

        {error && !showForm && (
          <p className="mb-4 text-sm text-red-400 border border-red-400/30 px-4 py-3">{error}</p>
        )}
        {success && (
          <p className="mb-4 text-sm text-pitty-gold border border-pitty-gold/30 px-4 py-3">
            {success}
          </p>
        )}

        <div className="border border-white/10 overflow-hidden">
          <div className="px-4 py-4 border-b border-white/10 bg-white/[0.02] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">
                All Products ({totalCount})
              </h2>
              {(search || categoryFilter || productFilter) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs uppercase tracking-wider text-white/50 hover:text-white"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="relative block lg:col-span-2">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full bg-black border border-white/20 pl-10 pr-3 py-2.5 text-sm focus:border-white outline-none"
                />
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-black border border-white/20 px-3 py-2.5 text-sm focus:border-white outline-none"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="bg-black border border-white/20 px-3 py-2.5 text-sm focus:border-white outline-none"
              >
                <option value="">All products</option>
                <option value="featured">Featured only</option>
                <option value="not_featured">Not featured</option>
                <option value="in_stock">In stock</option>
                <option value="out_of_stock">Out of stock</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/50 uppercase text-[10px] tracking-wider border-b border-white/10">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Featured</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt=""
                              className="w-10 h-10 object-cover bg-pitty-gray"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-white/40 line-clamp-1 max-w-[200px]">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/70">{product.category_name}</td>
                      <td className="px-4 py-3">${parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">{product.featured ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="p-2 text-white/60 hover:text-white"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            className="p-2 text-white/60 hover:text-red-400"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <p className="px-4 py-8 text-center text-white/40 text-sm">
                  {search || categoryFilter || productFilter
                    ? 'No products match your filters.'
                    : 'No products yet.'}
                </p>
              )}
            </div>
          )}

          {!loading && totalCount > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-white/10 bg-white/[0.02]">
              <p className="text-xs text-white/50">
                Showing {rangeStart}–{rangeEnd} of {totalCount} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 border border-white/20 text-white/70 hover:text-white hover:border-white disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs text-white/60 min-w-[80px] text-center">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 border border-white/20 text-white/70 hover:text-white hover:border-white disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/10 bg-black p-6">
              <button
                type="button"
                onClick={closeForm}
                className="absolute top-4 right-4 p-1 text-white/60 hover:text-white"
                aria-label="Close form"
              >
                <X size={20} />
              </button>

              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70 pr-8">
                  {editingId ? 'Edit Product' : 'New Product'}
                </h2>

                {error && (
                  <p className="text-sm text-red-400 border border-red-400/30 px-3 py-2">{error}</p>
                )}

                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-white/50">Name *</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full bg-black border border-white/20 px-3 py-2.5 text-sm focus:border-white outline-none"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-white/50">Slug (optional)</span>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated from name"
                    className="mt-1 w-full bg-black border border-white/20 px-3 py-2.5 text-sm focus:border-white outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-white/50">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="mt-1 w-full bg-black border border-white/20 px-3 py-2.5 text-sm focus:border-white outline-none resize-y"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-white/50">Price ($) *</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="mt-1 w-full bg-black border border-white/20 px-3 py-2.5 text-sm focus:border-white outline-none"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-white/50">Stock *</span>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="mt-1 w-full bg-black border border-white/20 px-3 py-2.5 text-sm focus:border-white outline-none"
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs uppercase tracking-wider text-white/50">Category *</span>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: Number(e.target.value) })}
                    className="mt-1 w-full bg-black border border-white/20 px-3 py-2.5 text-sm focus:border-white outline-none"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="text-sm text-white/80">Featured product</span>
                </label>

                <div className="space-y-2 border-t border-white/10 pt-5">
                  <span className="text-xs uppercase tracking-wider text-white/50">
                    Showcase images (by section) *
                  </span>
                  <AdminShowcaseSections
                    slots={form.showcaseSlots}
                    primarySlot={form.primaryShowcaseSlot}
                    compressingSlot={compressingSlot}
                    onPrimarySlotChange={(slot) =>
                      setForm((prev) => ({ ...prev, primaryShowcaseSlot: slot }))
                    }
                    onUpload={handleShowcaseUpload}
                    onClear={handleShowcaseClear}
                  />
                </div>

                {(form.existingImages.length > 0 || form.newImages.length > 0) && (
                  <div className="space-y-3 border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-wider text-white/50">
                      Legacy catalog images
                    </p>
                    <p className="text-[11px] text-white/35">
                      These images are not assigned to a showcase slot. Re-upload using the sections
                      above when you can.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {form.existingImages.map((image) => (
                        <div key={`existing-${image.id}`} className="relative border border-white/10">
                          <img
                            src={image.preview}
                            alt=""
                            className="w-full aspect-square object-cover bg-pitty-gray"
                          />
                          <div className="absolute inset-x-0 bottom-0 flex gap-1 p-2 bg-black/70">
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.id)}
                              className="flex-1 p-1 text-[10px] uppercase text-white/50 hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant="solid" disabled={saving}>
                    {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button type="button" variant="ghost" onClick={closeForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
