import { z } from 'zod';

export const TriggerPayoutDto = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  reason: z.enum(['DIVIDEND', 'BUYOUT'], { required_error: 'Reason is required' }),
  amount: z.number().positive('Amount must be positive').optional(),
});

export type TriggerPayoutDto = z.infer<typeof TriggerPayoutDto>;