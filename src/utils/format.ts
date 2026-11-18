// src/utils/format.ts
// Funciones pequeñas para mostrar datos del dominio.

import type { Item } from '../types';

// 150000 -> "$150.000"
export function formatPrice(price: number): string {
  return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

// "Adopción · Gratis" o "Venta · $150.000"
export function formatListing(item: Pick<Item, 'listing' | 'price'>): string {
  return item.listing === 'sale' ? `Venta · ${formatPrice(item.price)}` : 'Adopción · Gratis';
}
