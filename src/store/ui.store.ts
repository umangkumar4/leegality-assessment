import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  isFilterDrawerOpen: boolean;
  toggleSidebar: () => void;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  isFilterDrawerOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),
}));
