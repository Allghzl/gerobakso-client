import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, namePrefix?: string) => void;
  removeItem: (productId: number, itemName: string) => void;
  updateQuantity: (productId: number, itemName: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, namePrefix = '') => {
        set((state) => {
          const name = namePrefix ? `${namePrefix}${product.name}` : product.name;
          const existingItem = state.items.find((item) => item.id === product.id && item.name === name);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.name === name
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { ...product, name, quantity }] };
        });
      },
      removeItem: (productId, itemName) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === productId && item.name === itemName)),
        }));
      },
      updateQuantity: (productId, itemName, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === productId && item.name === itemName ? { ...item, quantity: Math.max(0, quantity) } : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      totalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'gerobakso-cart',
    }
  )
);
