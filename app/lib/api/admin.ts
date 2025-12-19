import {API_BASE_URL, apiRequest, getAuthHeaders, ApiResponse } from './config';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API;
// console.log('API_BASE_URL', API_BASE_URL);

export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface AdminResponse {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    lastLogin?: Date;
  };
}

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  recentOrdersCount: number;
}

export interface Product {
  _id?: string;
  id?: string;
  name: string;
  amount?: number;
  price?: number;
  description?: string;
  category?: string;
  imageurl?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Order {
  _id?: string;
  id?: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'initiated' | 'paid' | 'failed';
  userId?: string;
  shippingAddress?: string;
  contactEmail?: string;
  contactName?: string;
  notes?: string;
  placedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt?: Date;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  createdAt?: Date;
}

const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

export const adminApi = {
  login: async (payload: AdminLoginDto): Promise<ApiResponse<AdminResponse>> => {
    const url = `${API_BASE_URL}/admin/login`;
    if (typeof window !== 'undefined') {
      console.log('Admin Login - Calling URL:', url);
      console.log('Admin Login - API_BASE_URL:', API_BASE_URL);
    }
    return apiRequest<AdminResponse>(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  me: async (): Promise<ApiResponse<AdminResponse['admin']>> => {
    const token = getAdminToken();
    return apiRequest<AdminResponse['admin']>(`${API_BASE_URL}/admin/me`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const token = getAdminToken();
    return apiRequest<DashboardStats>(`${API_BASE_URL}/admin/dashboard/stats`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  getRecentOrders: async (): Promise<ApiResponse<Order[]>> => {
    const token = getAdminToken();
    return apiRequest<Order[]>(`${API_BASE_URL}/admin/dashboard/recent-orders`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Products
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<{ totalCount: number; data: Product[] }>> => {
    const token = getAdminToken();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    // Backend sometimes returns data: [] and sometimes data: { totalCount, data: [] }
    const resp = await apiRequest<any>(
      `${API_BASE_URL}/admin/products?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      },
    );

    let items: Product[] = [];
    let totalCount = 0;

    if (Array.isArray(resp.data)) {
      items = resp.data as Product[];
      totalCount = resp.totalCount ?? items.length;
    } else if (resp.data && typeof resp.data === 'object') {
      items = (resp.data.data as Product[]) || [];
      totalCount = resp.data.totalCount ?? items.length;
    }

    return {
      ...resp,
      data: {
        totalCount,
        data: items,
      },
    };
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const token = getAdminToken();
    return apiRequest<Product>(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  createProduct: async (formData: FormData): Promise<ApiResponse<Product>> => {
    const token = getAdminToken();
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type for FormData - browser will set it with boundary
    };
    
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create product');
    }
    
    // Backend returns Product directly, not wrapped in ApiResponse
    // Normalize it to match ApiResponse format
    if (data.success !== undefined) {
      return data;
    } else {
      return {
        success: true,
        code: response.status,
        message: 'Product created successfully',
        data: data,
      };
    }
  },

  updateProduct: async (id: string, payload: Partial<Product>): Promise<ApiResponse<Product>> => {
    const token = getAdminToken();
    return apiRequest<Product>(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  updateProductImage: async (id: string, formData: FormData): Promise<ApiResponse<Product>> => {
    const token = getAdminToken();
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type for FormData - browser will set it with boundary
    };
    
    const response = await fetch(`${API_BASE_URL}/admin/products/${id}/image`, {
      method: 'PATCH',
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product image');
    }
    
    // Backend may return Product directly, normalize it to match ApiResponse format
    if (data.success !== undefined) {
      return data;
    } else {
      return {
        success: true,
        code: response.status,
        message: 'Product image updated successfully',
        data: data,
      };
    }
  },

  deleteProduct: async (id: string): Promise<ApiResponse> => {
    const token = getAdminToken();
    return apiRequest(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  },

  // Orders
  getOrders: async (params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<{ totalCount: number; data: Order[] }>> => {
    const token = getAdminToken();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    
    return apiRequest<{ totalCount: number; data: Order[] }>(`${API_BASE_URL}/admin/orders?${queryParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  getOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const token = getAdminToken();
    return apiRequest<Order>(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  updateOrder: async (id: string, payload: { status?: string; shippingAddress?: string; notes?: string }): Promise<ApiResponse<Order>> => {
    const token = getAdminToken();
    return apiRequest<Order>(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  // Customers
  getCustomers: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<{ totalCount: number; data: Customer[] }>> => {
    const token = getAdminToken();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    return apiRequest<{ totalCount: number; data: Customer[] }>(`${API_BASE_URL}/admin/customers?${queryParams.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  getCustomer: async (id: string): Promise<ApiResponse<Customer>> => {
    const token = getAdminToken();
    return apiRequest<Customer>(`${API_BASE_URL}/admin/customers/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });
  },

  // Newsletter
  getNewsletterSubscribers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive';
  }): Promise<ApiResponse<{ totalCount: number; data: NewsletterSubscriber[] }>> => {
    const token = getAdminToken();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    return apiRequest<{ totalCount: number; data: NewsletterSubscriber[] }>(
      `${API_BASE_URL}/admin/newsletter?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: getAuthHeaders(token),
      },
    );
  },
};

