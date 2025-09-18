import { z } from 'zod';

export const CreateProposalDto = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  startsAt: z.string().datetime('Invalid start date'),
  endsAt: z.string().datetime('Invalid end date'),
});

export const UpdateProposalDto = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long').optional(),
  startsAt: z.string().datetime('Invalid start date').optional(),
  endsAt: z.string().datetime('Invalid end date').optional(),
});

export type CreateProposalDto = z.infer<typeof CreateProposalDto>;
export type UpdateProposalDto = z.infer<typeof UpdateProposalDto>;