"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateListingDto = void 0;
const zod_1 = require("zod");
exports.UpdateListingDto = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    description: zod_1.z.string().min(1, 'Description is required').max(2000, 'Description too long').optional(),
    locationText: zod_1.z.string().min(1, 'Location is required').max(500, 'Location too long').optional(),
    geoJson: zod_1.z.any().optional(),
    parcelSize: zod_1.z.number().positive('Parcel size must be positive').optional(),
    coordinatePolicy: zod_1.z.boolean().optional(),
    coordinatePolicyNote: zod_1.z.string().optional(),
    totalShares: zod_1.z.number().int().min(1, 'Must have at least 1 share').max(10000, 'Too many shares').optional(),
    pricePerShare: zod_1.z.number().positive('Price per share must be positive').optional(),
    status: zod_1.z.enum(['PENDING', 'LIVE', 'PAUSED', 'CLOSED']).optional(),
});
//# sourceMappingURL=update-listing.dto.js.map