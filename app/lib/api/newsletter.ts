import { API_ENDPOINTS, apiRequest, ApiResponse } from './config';

export interface SubscribeNewsletterDto {
  email: string;
}

export interface Newsletter {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const newsletterApi = {
  subscribe: async (payload: SubscribeNewsletterDto): Promise<ApiResponse<Newsletter>> => {
    return apiRequest(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

