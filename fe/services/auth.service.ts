import axiosClient from "../lib/axios";
import { User } from "../store/useAuthStore";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  data: {
    id: number;
    email: string;
    fullname: string;
    password_hash: string;
    phone?: string;
    role: string;
    updatedAt: string;
    createdAt: string;
  };
}

export interface ForgotResponse {
  message: string;
}

export interface VerifyResetResponse {
  valid: boolean;
  // additional fields may be returned depending on backend
}

export interface ResetPasswordResponse {
  message: string;
}

export const authService = {
  login: async (data: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await axiosClient.post<LoginResponse>("/auth/login", data);
    return res as unknown as LoginResponse;
  },
  register: async (data: { fullname: string; email: string; password: string; phone?: string }): Promise<RegisterResponse> => {
    const res = await axiosClient.post<RegisterResponse>("/auth/register", data);
    return res as unknown as RegisterResponse;
  },
  forgotPassword: async (data: { email: string }): Promise<ForgotResponse> => {
    const res = await axiosClient.post<ForgotResponse>("/auth/forgot-password", data);
    return res as unknown as ForgotResponse;
  },
  verifyResetToken: async (token: string): Promise<VerifyResetResponse> => {
    const res = await axiosClient.get<VerifyResetResponse>(`/auth/reset-password/${token}`);
    return res as unknown as VerifyResetResponse;
  },
  resetPassword: async (data: { token: string; password: string }): Promise<ResetPasswordResponse> => {
    const res = await axiosClient.post<ResetPasswordResponse>("/auth/reset-password", data);
    return res as unknown as ResetPasswordResponse;
  },
  updateProfile: async (data: { fullname?: string; phone?: string }) => {
    // backend update endpoint with /api mount
    const res = await axiosClient.put<{ message: string; data: any }>("http://localhost:3001/api/auth/update-profile", data);
    return res as unknown as { message: string; data: any };
  },
};