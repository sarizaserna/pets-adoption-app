// src/hooks/useItems.ts
// Hooks que leen datos del servidor. Las pantallas usan estos hooks,
// nunca llaman a apiClient directamente.

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type { Item } from '../types';

// "Etiqueta" de la caché. Todo lo que se guarde bajo ['pets'] se invalida junto.
// Está en un solo lugar para no cometer errores de escritura al invalidar.
export const ITEMS_QUERY_KEY = ['pets'] as const;

// Lista de mascotas: GET {baseURL}/pets
export function useItems() {
  return useQuery({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async (): Promise<Item[]> => {
      const { data } = await apiClient.get<Item[]>('/pets');
      return data;
    },
  });
}

// Una sola mascota por id: GET {baseURL}/pets/:id
// La queryKey incluye el id, así cada mascota tiene su propia entrada en la caché.
export function useItemById(id: string) {
  return useQuery({
    queryKey: [...ITEMS_QUERY_KEY, id],
    queryFn: async (): Promise<Item> => {
      const { data } = await apiClient.get<Item>(`/pets/${id}`);
      return data;
    },
    enabled: id.length > 0,
  });
}
