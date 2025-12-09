import { API_ENDPOINTS, apiRequest, ApiResponse } from './config';
import { Product } from '@/app/types';

export interface ProductFilters {
  limit?: number;
  page?: number;
  search?: string;
  category?: string;
}

export const productsApi = {
  getFeatured: async (): Promise<ApiResponse<{ data: Product[] }>> => {
    return apiRequest(API_ENDPOINTS.PRODUCTS.FEATURED);
  },

  getNewArrivals: async (): Promise<ApiResponse<{ data: Product[] }>> => {
    return apiRequest(API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS);
  },

  getAll: async (filters?: ProductFilters): Promise<ApiResponse<{ totalCount: number; data: Product[] }>> => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);

    const url = `${API_ENDPOINTS.PRODUCTS.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest(url);
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiRequest(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },
};

