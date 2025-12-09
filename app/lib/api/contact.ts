import { API_ENDPOINTS, apiRequest, ApiResponse } from './config';

export interface CreateContactDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  resolved: boolean;
  createdAt: Date;
}

export interface ContactFilters {
  limit?: number;
  page?: number;
  resolved?: boolean;
}

export const contactApi = {
  create: async (payload: CreateContactDto): Promise<ApiResponse<Contact>> => {
    return apiRequest(API_ENDPOINTS.CONTACT.CREATE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAll: async (
    filters?: ContactFilters
  ): Promise<ApiResponse<{ totalCount: number; data: Contact[] }>> => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.resolved !== undefined) params.append('resolved', filters.resolved.toString());

    const url = `${API_ENDPOINTS.CONTACT.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiRequest(url);
  },
};

