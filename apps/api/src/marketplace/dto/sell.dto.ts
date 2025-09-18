import { z } from 'zod';

export const SellDto = z.object({
  shareMint: z.string().min(1, 'Share mint address is required'),
  price: z.number().positive('Price must be positive'),
});

export type SellDto = z.infer<typeof SellDto>;