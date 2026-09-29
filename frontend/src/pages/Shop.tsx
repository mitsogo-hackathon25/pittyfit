import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../api/endpoints';
import type { Category, Product } from '../api/types';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({
      category: activeCategory || undefined,
      search: searchQuery || undefined,
    })
      .then((data) => setProducts(data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, searchQuery]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-3">Shop</p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            All Products
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-colors ${
              !activeCategory
                ? 'bg-white text-black border-white'
                : 'border-white/30 text-white/70 hover:border-white'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-white text-black border-white'
                  : 'border-white/30 text-white/70 hover:border-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-white/10 mb-3" />
                <div className="h-4 bg-white/10 w-2/3 mb-2" />
                <div className="h-4 bg-white/10 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-white/50 text-center py-20">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
