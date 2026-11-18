// src/stores/savedStore.ts
// Favoritos. REGLA DE LA SEMANA: aquí solo se guardan los IDs.
// Los datos de las mascotas viven en la caché de TanStack Query, no en Zustand.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedStore {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  removeSaved: (id: string) => void;
  clearAll: () => void;
}

// Forma que tenía lo guardado en la semana 4 (mascotas completas).
interface LegacySavedState {
  items?: { id: string }[];
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set) => ({
      savedIds: [],
      toggleSaved: (id) => {
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((savedId) => savedId !== id)
            : [...state.savedIds, id],
        }));
      },
      removeSaved: (id) => {
        set((state) => ({ savedIds: state.savedIds.filter((savedId) => savedId !== id) }));
      },
      clearAll: () => set({ savedIds: [] }),
    }),
    {
      name: 'pets-saved-storage',
      // version 1: cambió la forma de lo guardado (de `items` a `savedIds`).
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ savedIds: state.savedIds }),
      // Si el teléfono tiene datos de la semana 4, los convertimos a ids.
      migrate: (persisted) => {
        const legacy = persisted as LegacySavedState | null;
        return { savedIds: (legacy?.items ?? []).map((item) => item.id) };
      },
    },
  ),
);
