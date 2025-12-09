import { API_ENDPOINTS, apiRequest, getAuthHeaders, ApiResponse } from './config';
import { Product } from '@/app/types';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface CartResponse {
  items?: CartItem[]; // Frontend format
  cart?: CartItem[]; // Backend format (cart array)
  total: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export const cartApi = {
  getCart: async (token: string): Promise<ApiResponse<CartResponse>> => {
    return apiRequest(API_ENDPOINTS.CART.GET, {
      headers: getAuthHeaders(token),
    });
  },

  addToCart: async (
    token: string,
    payload: AddToCartDto
  ): Promise<ApiResponse<CartResponse>> => {
    return apiRequest(API_ENDPOINTS.CART.ADD, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  removeFromCart: async (
    token: string,
    cartItemId: string
  ): Promise<ApiResponse<CartResponse>> => {
    return apiRequest(API_ENDPOINTS.CART.REMOVE(cartItemId), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  },

  clearCart: async (token: string): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.CART.CLEAR, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
  },
};

