import { useEffect, useState } from 'react';
import { getOrders } from '../api/endpoints';
import type { Order } from '../api/types';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">My Account</h1>
            <p className="text-white/50 mt-2">{user?.email}</p>
          </div>
          <Button onClick={logout} variant="ghost">Sign Out</Button>
        </div>

        <section>
          <h2 className="text-xs tracking-[0.2em] uppercase text-white/50 mb-6">Order History</h2>

          {loading ? (
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : orders.length === 0 ? (
            <div className="text-center py-12 border border-white/10">
              <p className="text-white/50 mb-6">No orders yet.</p>
              <Button to="/shop" variant="ghost">Start Shopping →</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-white/10 p-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-white/50">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${parseFloat(order.total).toFixed(2)}</p>
                      <p className="text-xs uppercase tracking-wider text-pitty-gold">
                        {order.status}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-white/60">
                        <span>{item.product_name} × {item.quantity}</span>
                        <span>${parseFloat(item.price_at_purchase).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
