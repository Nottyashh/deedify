import { z } from 'zod';

export const ListDto = z.object({
  shareMint: z.string().min(1, 'Share mint address is required'),
  price: z.number().positive('Price must be positive'),
});

export type ListDto = z.infer<typeof ListDto>;