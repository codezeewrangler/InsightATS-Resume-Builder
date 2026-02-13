import { create } from 'zustand';
import { authApi } from '@/lib/authApi';
import { useFreeTierStore } from './freeTierStore';

interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  error?: string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  refresh: () => Promise<boolean>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  status: 'idle',
  error: undefined,
  login: async (email: string, password: string) => {
    set({ status: 'loading', error: undefined });
    try {
      const { user, accessToken } = await authApi.login({ email, password });
      set({ user, accessToken, status: 'authenticated' });
      await useFreeTierStore.getState().refresh(accessToken);
    } catch (error) {
      set({ status: 'error', error: (error as Error).message });
      throw error;
    }
  },
  register: async (email: string, password: string, fullName?: string) => {
    set({ status: 'loading', error: undefined });
    try {
      await authApi.register({ email, password, fullName });
      const { user, accessToken } = await authApi.login({ email, password });
      set({ user, accessToken, status: 'authenticated' });
      await useFreeTierStore.getState().refresh(accessToken);
    } catch (error) {
      set({ status: 'error', error: (error as Error).message });
      throw error;
    }
  },
  refresh: async () => {
    try {
      const { user, accessToken } = await authApi.refresh();
      set({ user, accessToken, status: 'authenticated', error: undefined });
      await useFreeTierStore.getState().refresh(accessToken);
      return true;
    } catch (error) {
      set({ user: null, accessToken: null, status: 'idle' });
      useFreeTierStore.getState().clear();
      return false;
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, accessToken: null, status: 'idle' });
      useFreeTierStore.getState().clear();
    }
  },
  bootstrap: async () => {
    if (get().status === 'authenticated') {
      return;
    }
    await get().refresh();
  },
}));
