import { API_ENDPOINTS, apiRequest, ApiResponse } from './config';

export interface ShippingCost {
  cost: number;
}

export const shippingApi = {
  getCurrent: async (): Promise<ApiResponse<ShippingCost>> => {
    return apiRequest(API_ENDPOINTS.SHIPPING.CURRENT);
  },
};


