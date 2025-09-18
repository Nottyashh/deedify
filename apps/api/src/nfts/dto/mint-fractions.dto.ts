import { z } from 'zod';

export const MintFractionsDto = z.object({
  listingId: z.string().cuid('Invalid listing ID'),
  totalShares: z.number().int().min(1, 'Must have at least 1 share').max(10000, 'Too many shares'),
  baseName: z.string().min(1, 'Base name is required').max(100, 'Base name too long'),
  baseDescription: z.string().min(1, 'Base description is required').max(1000, 'Base description too long'),
  image: z.string().url('Invalid image URL').optional(),
  attributes: z.array(z.object({
    trait_type: z.string().min(1, 'Trait type is required'),
    value: z.union([z.string(), z.number()]),
  })).optional(),
});

export type MintFractionsDto = z.infer<typeof MintFractionsDto>;