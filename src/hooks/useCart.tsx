import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'plan' | 'addon';
}

export interface CartCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
}

interface CartState {
  items: CartItem[];
  coupon: CartCoupon | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (coupon: CartCoupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      clearCart: () => {
        set({ items: [], coupon: null });
      },
      
      applyCoupon: (coupon) => {
        set({ coupon });
      },
      
      removeCoupon: () => {
        set({ coupon: null });
      },
      
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;
        
        const subtotal = get().getSubtotal();
        if (coupon.type === 'percentage') {
          return (subtotal * coupon.value) / 100;
        }
        return coupon.value;
      },
      
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return Math.max(0, subtotal - discount);
      },
    }),
    {
      name: 'minecraft-cart-storage',
    }
  )
);
