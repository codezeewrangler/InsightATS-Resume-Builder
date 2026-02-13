import { create } from 'zustand';
import { ApiError } from '@/lib/apiClient';
import { FreeTierUsageResponse, usageApi } from '@/lib/usageApi';

interface FreeTierState {
  data: FreeTierUsageResponse | null;
  loading: boolean;
  error: string | null;
  refresh: (accessToken: string, resumeId?: string) => Promise<void>;
  clear: () => void;
}

export const useFreeTierStore = create<FreeTierState>((set) => ({
  data: null,
  loading: false,
  error: null,
  refresh: async (accessToken: string, resumeId?: string) => {
    set({ loading: true, error: null });

    try {
      const data = await usageApi.get(accessToken, resumeId);
      set({ data, loading: false, error: null });
    } catch (error) {
      if (error instanceof ApiError) {
        set({ loading: false, error: error.message });
      } else {
        set({ loading: false, error: 'Failed to fetch free-tier usage' });
      }
    }
  },
  clear: () => set({ data: null, loading: false, error: null }),
}));
