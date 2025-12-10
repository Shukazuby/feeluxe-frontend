// API Configuration
// You can override this by setting NEXT_PUBLIC_API in your .env.local file
export const API_BASE_URL = process.env.NEXT_PUBLIC_API;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/customers`,
  },
  // Products
  PRODUCTS: {
    LIST: `${API_BASE_URL}/product`,
    FEATURED: `${API_BASE_URL}/product/featured/list`,
    NEW_ARRIVALS: `${API_BASE_URL}/product/new-arrivals`,
    BY_ID: (id: string) => `${API_BASE_URL}/product/${id}`,
  },
  // Customers
  CUSTOMERS: {
    CREATE: `${API_BASE_URL}/customers`,
    ME: `${API_BASE_URL}/customers/me`,
    UPDATE: `${API_BASE_URL}/customers/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/customers/change-password`,
    WISHLIST: `${API_BASE_URL}/customers/wishlist`,
    ADD_TO_WISHLIST: `${API_BASE_URL}/customers/wishlist`,
    REMOVE_FROM_WISHLIST: (productId: string) => `${API_BASE_URL}/customers/wishlist/${productId}`,
    REMOVE_WISHLIST: `${API_BASE_URL}/customers/wishlist/remove`,
  },
  // Cart
  CART: {
    GET: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/add`,
    REMOVE: (cartItemId: string) => `${API_BASE_URL}/cart/remove/${cartItemId}`,
    CLEAR: `${API_BASE_URL}/cart/clear/all`,
  },
  // Orders
  ORDERS: {
    CREATE: `${API_BASE_URL}/orders`,
    LIST: `${API_BASE_URL}/orders`,
    BY_ID: (id: string) => `${API_BASE_URL}/orders/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/orders/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/orders/${id}`,
    INITIALIZE_PAYMENT: (id: string) => `${API_BASE_URL}/orders/${id}/paystack/initialize`,
    SHIPPING_ESTIMATE: `${API_BASE_URL}/orders/shipping/estimate`,
  },
  // Contact
  CONTACT: {
    CREATE: `${API_BASE_URL}/contact`,
    LIST: `${API_BASE_URL}/contact`,
    RESOLVE: (id: string) => `${API_BASE_URL}/contact/${id}/resolve`,
  },
  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: `${API_BASE_URL}/newsletter/subscribe`,
  },
};

// Helper function to get auth headers
export const getAuthHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  totalCount?: number;
  limit?: number;
  page?: number;
  search?: string;
}

// Error handler
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add ngrok-skip-browser-warning header if using ngrok
    if (url.includes('ngrok')) {
      // TypeScript's HeadersInit can be an object or Headers, so for explicit typing:
      if (typeof headers === 'object' && !('append' in headers)) {
        (headers as Record<string, string>)['ngrok-skip-browser-warning'] = 'true';
      } else if (headers instanceof Headers) {
        headers.append('ngrok-skip-browser-warning', 'true');
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || 'An error occurred',
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Network error occurred', error);
  }
}

