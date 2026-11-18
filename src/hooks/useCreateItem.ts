// src/hooks/useCreateItem.ts
// Hook que ESCRIBE datos en el servidor (crear una mascota).

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type { CreateItemPayload, Item } from '../types';
import { ITEMS_QUERY_KEY } from './useItems';

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    // Qué petición hacer: POST {baseURL}/pets con los datos del formulario.
    mutationFn: async (payload: CreateItemPayload): Promise<Item> => {
      const { data } = await apiClient.post<Item>('/pets', payload);
      return data;
    },
    // Cuando el servidor responde OK: marcar la lista como "vieja" (invalidar).
    // TanStack Query la vuelve a pedir sola y la pantalla se actualiza.
    // El `return` hace que isPending siga en true hasta que la lista termine de recargar.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY }),
  });
}
