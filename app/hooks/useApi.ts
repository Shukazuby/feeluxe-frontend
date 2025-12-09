import { useAuth } from '@/app/components/AuthProvider';
import { productsApi } from '@/app/lib/api/products';
import { customersApi } from '@/app/lib/api/customers';
import { cartApi } from '@/app/lib/api/cart';
import { ordersApi } from '@/app/lib/api/orders';
import { contactApi } from '@/app/lib/api/contact';

/**
 * Custom hook that provides API access with automatic token injection
 */
export function useApi() {
  const { token, requireAuth } = useAuth();

  const ensureAuth = () => {
    if (!token) {
      throw new Error('Authentication required');
    }
    return token;
  };

  return {
    // Products (public)
    products: {
      getFeatured: productsApi.getFeatured,
      getNewArrivals: productsApi.getNewArrivals,
      getAll: productsApi.getAll,
      getById: productsApi.getById,
    },

    // Customers (requires auth)
    customers: {
      getProfile: () => customersApi.getProfile(ensureAuth()),
      updateProfile: (payload: Parameters<typeof customersApi.updateProfile>[1]) =>
        customersApi.updateProfile(ensureAuth(), payload),
      changePassword: (payload: Parameters<typeof customersApi.changePassword>[1]) =>
        customersApi.changePassword(ensureAuth(), payload),
      getWishlist: () => customersApi.getWishlist(ensureAuth()),
      addToWishlist: (payload: Parameters<typeof customersApi.addToWishlist>[1]) =>
        customersApi.addToWishlist(ensureAuth(), payload),
      removeFromWishlist: (productId: string) =>
        customersApi.removeFromWishlist(ensureAuth(), productId),
    },

    // Cart (requires auth)
    cart: {
      getCart: () => cartApi.getCart(ensureAuth()),
      addToCart: (payload: Parameters<typeof cartApi.addToCart>[1]) =>
        cartApi.addToCart(ensureAuth(), payload),
      removeFromCart: (cartItemId: string) =>
        cartApi.removeFromCart(ensureAuth(), cartItemId),
      clearCart: () => cartApi.clearCart(ensureAuth()),
    },

    // Orders (requires auth)
    orders: {
      create: (payload: Parameters<typeof ordersApi.create>[1]) =>
        ordersApi.create(ensureAuth(), payload),
      getAll: (filters?: Parameters<typeof ordersApi.getAll>[1]) =>
        ordersApi.getAll(ensureAuth(), filters),
      getById: (id: string) => ordersApi.getById(ensureAuth(), id),
      update: (id: string, payload: Parameters<typeof ordersApi.update>[2]) =>
        ordersApi.update(ensureAuth(), id, payload),
      delete: (id: string) => ordersApi.delete(ensureAuth(), id),
      initializePayment: (orderId: string) =>
        ordersApi.initializePayment(ensureAuth(), orderId),
    },

    // Contact (public)
    contact: {
      create: contactApi.create,
      getAll: contactApi.getAll,
    },

    // Auth helpers
    requireAuth,
    isAuthenticated: !!token,
  };
}

