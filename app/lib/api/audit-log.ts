import { API_BASE_URL, apiRequest, ApiResponse, getAuthHeaders } from './config';

export interface AuditLogData {
  ipAddress?: string;
  visitedPage?: string;
  activity?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  customerId?: string;
  userId?: string;
  email?: string;
  lastLogged?: string;
  method?: string;
  statusCode?: number;
  metadata?: Record<string, any>;
  sessionId?: string;
  referer?: string;
}

export const auditLogApi = {
  create: async (data: AuditLogData): Promise<ApiResponse> => {
    try {
      // Get auth token from localStorage if available
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('feeluxe-token') 
        : null;
      
      return await apiRequest(`${API_BASE_URL}/audit-log`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Silently fail - don't interrupt user experience
      console.error('Failed to log audit:', error);
      return {
        success: false,
        code: 500,
        message: 'Failed to log audit',
      };
    }
  },
};

