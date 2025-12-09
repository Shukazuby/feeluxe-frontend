import { API_ENDPOINTS, apiRequest, getAuthHeaders, ApiResponse } from './config';
import { Product } from '@/app/types';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

export interface Order {
  _id?: string; // MongoDB ID from backend
  id?: string; // Fallback ID
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  userId: string;
  shippingAddress?: string;
  contactEmail?: string;
  contactName?: string;
  notes?: string;
  placedAt: Date;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to get order ID (handles both _id and id)
export const getOrderId = (order: Order): string => {
  return order._id || order.id || '';
};

export interface CreateOrderDto {
  cartItemIds: string[];
  notes?: string;
}

export interface UpdateOrderDto {
  status?: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  notes?: string;
}

export interface OrderFilters {
  limit?: number;
  page?: number;
  status?: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaymentInitResponse {
  authorizationUrl: string;
  reference: string;
}

export const ordersApi = {
  create: async (
    token: string,
    payload: CreateOrderDto
  ): Promise<ApiResponse<Order>> => {
    return apiRequest(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  getAll: async (
    token: string,
    filters?: OrderFilters
  ): Promise<ApiResponse<{ totalCount: number; data: Order[] }>> => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const url = `${API_ENDPOINTS.ORDERS.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest(url, {
      headers: getAuthHeaders(token),
    });
  },

  getById: async (
    token: string,
    id: string
  ): Promise<ApiResponse<Order>> => {
    return apiRequest(API_ENDPOINTS.ORDERS.BY_ID(id), {
      headers: getAuthHeaders(token),
    });
  },

  update: async (
    token: string,
    id: string,
    payload: UpdateOrderDto
  ): Promise<ApiResponse<Order>> => {
    return apiRequest(API_ENDPOINTS.ORDERS.UPDATE(id), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  delete: async (token: string, id: string): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.ORDERS.DELETE(id), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  },

  initializePayment: async (
    token: string,
    orderId: string
  ): Promise<ApiResponse<PaymentInitResponse>> => {
    return apiRequest(API_ENDPOINTS.ORDERS.INITIALIZE_PAYMENT(orderId), {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
  },
};

