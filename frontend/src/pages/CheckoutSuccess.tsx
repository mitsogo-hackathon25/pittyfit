import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { refreshCart } = useCart();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <div className="py-12 sm:py-16 min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full border-2 border-pitty-gold flex items-center justify-center mb-8">
        <svg className="w-8 h-8 text-pitty-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Order Confirmed</h1>
      <p className="text-white/60 mb-2 max-w-md">
        Thank you for your purchase. Your order is being processed.
      </p>
      {orderId && (
        <p className="text-sm text-white/40 mb-8">Order #{orderId}</p>
      )}
      <div className="flex gap-4">
        <Button to="/shop" variant="ghost">Continue Shopping</Button>
        <Button to="/account" variant="solid">View Orders</Button>
      </div>
    </div>
  );
}
