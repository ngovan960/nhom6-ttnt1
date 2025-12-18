import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, LoginResponse } from "../services/auth.service";

/* ================= USER TYPE ================= */
export interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  avatar?: string | null;
  thumbnail?: string | null;
}

/* ================= AUTH STATE ================= */
interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (data: { fullname?: string; phone?: string }) => Promise<any>;
}

/* ================= STORE ================= */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      /* ========== LOGIN ========== */
      login: async (email, password) => {
        set({ loading: true });

        try {
          const res = await authService.login({ email, password });

          set({
            user: res.user,
            token: res.token,
            loading: false,
          });

          return res.user;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      /* ========== LOGOUT ========== */
      logout: () => {
        set({
          user: null,
          token: null,
          loading: false,
        });
      },

      /* ========== UPDATE PROFILE ========== */
      updateProfile: async (data) => {
        set({ loading: true });
        try {
          const res = await authService.updateProfile(data);
          // server returns { message, data: user }
          const updated = (res as any).data;
          set((state: any) => ({ user: { ...(state.user || {}), ...(updated || {}) }, loading: false }));
          return updated;
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },
    }),
    {
      name: "auth-storage",

      // 🔥 Chỉ persist thứ cần thiết
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
