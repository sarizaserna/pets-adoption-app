import { z } from 'zod';

export const petFormSchema = z
  .object({
    name: z
      .string({ error: 'El nombre es obligatorio' })
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres'),
    breed: z.string().trim().optional().or(z.literal('')),
    age: z.string().trim().optional().or(z.literal('')),
    gender: z.enum(['Macho', 'Hembra']),
    listing: z.enum(['adoption', 'sale']),
    price: z.string().trim().optional().or(z.literal('')),
    description: z
      .string()
      .trim()
      .max(300, 'Máximo 300 caracteres')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((values, ctx) => {
    if (values.listing === 'sale') {
      const numericPrice = Number((values.price ?? '').replace(/\D/g, ''));
      if (!numericPrice || numericPrice <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['price'],
          message: 'Ingresa un precio válido mayor a 0 para venta',
        });
      }
    }
  });

export type PetFormValues = z.infer<typeof petFormSchema>;