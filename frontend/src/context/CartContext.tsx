import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  addToCart as apiAddToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../api/endpoints';
import type { Cart } from '../api/types';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity = 1) => {
    const data = await apiAddToCart(productId, quantity);
    setCart(data);
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    const data = await updateCartItem(itemId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId: number) => {
    const data = await removeCartItem(itemId);
    setCart(data);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshCart,
        addToCart,
        updateQuantity,
        removeItem,
        itemCount: cart?.item_count ?? 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
