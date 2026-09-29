import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, loading, updateQuantity, removeItem } = useCart();

  if (loading) {
    return (
      <div className="py-12 sm:py-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = cart?.total ?? '0';

  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-10">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 mb-8">Your cart is empty.</p>
            <Button to="/shop" variant="ghost">Continue Shopping →</Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 sm:gap-6 border border-white/10 p-4"
                >
                  <Link to={`/shop/${item.product.slug}`} className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-32 object-cover bg-pitty-gray"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/shop/${item.product.slug}`}
                        className="font-medium hover:text-white/70 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-white/50 mt-1">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-white/30 flex items-center justify-center hover:border-white transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-white/30 flex items-center justify-center hover:border-white transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          ${parseFloat(item.subtotal).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-white/40 hover:text-white transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider">Subtotal</p>
                <p className="text-2xl font-bold">${parseFloat(total).toFixed(2)}</p>
              </div>
              <div className="flex gap-4">
                <Button to="/shop" variant="ghost">Continue Shopping</Button>
                <Button to="/checkout" variant="solid">Checkout →</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
