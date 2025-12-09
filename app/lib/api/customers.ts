import { API_ENDPOINTS, apiRequest, getAuthHeaders, ApiResponse } from './config';
import { Product } from '@/app/types';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface WishlistDto {
  productId: string;
}

export const customersApi = {
  getProfile: async (token: string): Promise<ApiResponse<Customer>> => {
    return apiRequest(API_ENDPOINTS.CUSTOMERS.ME, {
      headers: getAuthHeaders(token),
    });
  },

  updateProfile: async (
    token: string,
    payload: UpdateCustomerDto
  ): Promise<ApiResponse<Customer>> => {
    return apiRequest(API_ENDPOINTS.CUSTOMERS.UPDATE, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  changePassword: async (
    token: string,
    payload: ChangePasswordDto
  ): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.CUSTOMERS.CHANGE_PASSWORD, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  getWishlist: async (token: string): Promise<ApiResponse<Product[]>> => {
    return apiRequest(API_ENDPOINTS.CUSTOMERS.WISHLIST, {
      headers: getAuthHeaders(token),
    });
  },

  addToWishlist: async (
    token: string,
    payload: WishlistDto
  ): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.CUSTOMERS.ADD_TO_WISHLIST, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  removeFromWishlist: async (
    token: string,
    productId: string
  ): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.CUSTOMERS.REMOVE_FROM_WISHLIST(productId), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  },
};

