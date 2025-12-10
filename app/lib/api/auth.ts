import { API_ENDPOINTS, apiRequest, getAuthHeaders, ApiResponse } from './config';

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

export const authApi = {
  login: async (payload: LoginDto): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  signup: async (payload: SignupDto): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  forgotPassword: async (payload: ForgotPasswordDto): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  resetPassword: async (payload: ResetPasswordDto): Promise<ApiResponse> => {
    return apiRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

