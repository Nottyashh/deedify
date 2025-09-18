import { z } from 'zod';

export const CreateListingDto = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  locationText: z.string().min(1, 'Location is required').max(500, 'Location too long'),
  geoJson: z.any().optional(), // GeoJSON object for parcel boundaries
  parcelSize: z.number().positive('Parcel size must be positive'),
  coordinatePolicy: z.boolean().default(true),
  coordinatePolicyNote: z.string().optional(),
  totalShares: z.number().int().min(1, 'Must have at least 1 share').max(10000, 'Too many shares').default(100),
  pricePerShare: z.number().positive('Price per share must be positive'),
});

export type CreateListingDto = z.infer<typeof CreateListingDto>;