import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/api';

export interface CartItem {
  id: string; // Unique ID for the cart item (can be product ID or a composite for custom bowls)
  productId?: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isCustom?: boolean;
  components?: {
    id: number;
    name: string;
    category: string;
    price: number;
  }[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const existingItems = get().items;
        const existingItemIndex = existingItems.findIndex(
          (item) => item.id === newItem.id
        );

        if (existingItemIndex !== -1 && !newItem.isCustom) {
          const updatedItems = [...existingItems];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...existingItems, newItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const updatedItems = get().items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTax: () => {
        return get().getSubtotal() * 0.11;
      },

      getTotalPrice: () => {
        return get().getSubtotal() + get().getTax();
      },
    }),
    {
      name: 'gerobakso-cart-storage',
    }
  )
);
