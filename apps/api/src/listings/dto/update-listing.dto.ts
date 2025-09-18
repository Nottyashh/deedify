import { z } from 'zod';

export const UpdateListingDto = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long').optional(),
  locationText: z.string().min(1, 'Location is required').max(500, 'Location too long').optional(),
  geoJson: z.any().optional(), // GeoJSON object for parcel boundaries
  parcelSize: z.number().positive('Parcel size must be positive').optional(),
  coordinatePolicy: z.boolean().optional(),
  coordinatePolicyNote: z.string().optional(),
  totalShares: z.number().int().min(1, 'Must have at least 1 share').max(10000, 'Too many shares').optional(),
  pricePerShare: z.number().positive('Price per share must be positive').optional(),
  status: z.enum(['PENDING', 'LIVE', 'PAUSED', 'CLOSED']).optional(),
});

export type UpdateListingDto = z.infer<typeof UpdateListingDto>;