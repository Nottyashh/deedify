import { z } from 'zod';

export const BuyDto = z.object({
  shareMint: z.string().min(1, 'Share mint address is required'),
  buyerWallet: z.string().min(1, 'Buyer wallet address is required'),
});

export type BuyDto = z.infer<typeof BuyDto>;