import { Product, getProductId } from '@/app/types';

const CART_KEY = 'feeluxe-guest-cart';
const WISHLIST_KEY = 'feeluxe-guest-wishlist';

export interface GuestCartItem {
  product: Product;
  quantity: number;
}

export const guestCart = {
  get(): GuestCartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
    } catch {
      return [];
    }
  },
  set(items: GuestCartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },
  add(product: Product, quantity = 1) {
    const pid = getProductId(product);
    if (!pid) return;
    const items = this.get();
    const idx = items.findIndex((i) => getProductId(i.product) === pid);
    if (idx >= 0) {
      items[idx].quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.set(items);
  },
  update(productId: string, quantity: number) {
    const items = this.get().map((item) => {
      const id = getProductId(item.product);
      if (id === productId) return { ...item, quantity: Math.max(quantity, 1) };
      return item;
    });
    this.set(items);
  },
  remove(productId: string) {
    const items = this.get().filter((item) => getProductId(item.product) !== productId);
    this.set(items);
  },
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_KEY);
  },
};

export const guestWishlist = {
  get(): Product[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  },
  set(items: Product[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  },
  add(product: Product) {
    const pid = getProductId(product);
    if (!pid) return;
    const items = this.get();
    const exists = items.some((p) => getProductId(p) === pid);
    if (!exists) {
      items.push(product);
      this.set(items);
    }
  },
  remove(productId: string) {
    const items = this.get().filter((p) => getProductId(p) !== productId);
    this.set(items);
  },
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(WISHLIST_KEY);
  },
};

