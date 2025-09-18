import { z } from 'zod';

export const MintCollectionDto = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  image: z.string().url('Invalid image URL').optional(),
  attributes: z.array(z.object({
    trait_type: z.string().min(1, 'Trait type is required'),
    value: z.union([z.string(), z.number()]),
  })).optional(),
});

export type MintCollectionDto = z.infer<typeof MintCollectionDto>;