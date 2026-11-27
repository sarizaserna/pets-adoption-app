// src/hooks/useUpdateItem.ts
// Hook que ACTUALIZA una mascota existente en el servidor (PUT /pets/:id).

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '../services/api';
import type { CreateItemPayload, Item } from '../types';
import { ITEMS_QUERY_KEY } from './useItems';

interface UpdateItemParams {
  id: string;
  payload: Partial<CreateItemPayload>;
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateItemParams): Promise<Item> => {
      const { data } = await apiClient.put<Item>(`/pets/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY }),
  });
}