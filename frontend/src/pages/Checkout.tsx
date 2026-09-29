import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckout } from '../api/endpoints';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    shipping_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    shipping_email: user?.email || '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart?.items.length) {
      navigate('/cart');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await createCheckout(form);
      window.location.href = result.checkout_url;
    } catch {
      setError('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (!cart?.items.length) {
    return (
      <div className="py-12 sm:py-16 min-h-screen flex flex-col items-center justify-center">
        <p className="text-white/50 mb-6">Your cart is empty.</p>
        <Button to="/shop" variant="ghost">Go to Shop →</Button>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Checkout</h1>
        <p className="text-white/50 mb-10">
          Total: <span className="text-white font-semibold">${parseFloat(cart.total).toFixed(2)}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              Full Name
            </label>
            <input
              name="shipping_name"
              value={form.shipping_name}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              Email
            </label>
            <input
              name="shipping_email"
              type="email"
              value={form.shipping_email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              Address
            </label>
            <input
              name="shipping_address"
              value={form.shipping_address}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
                City
              </label>
              <input
                name="shipping_city"
                value={form.shipping_city}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
                State
              </label>
              <input
                name="shipping_state"
                value={form.shipping_state}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              ZIP Code
            </label>
            <input
              name="shipping_zip"
              value={form.shipping_zip}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" variant="solid" disabled={loading} className="w-full justify-center">
            {loading ? 'Processing...' : 'Place Order →'}
          </Button>
        </form>
      </div>
    </div>
  );
}
