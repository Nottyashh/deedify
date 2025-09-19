"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateListingDto = void 0;
const zod_1 = require("zod");
exports.CreateListingDto = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: zod_1.z.string().min(1, 'Description is required').max(2000, 'Description too long'),
    locationText: zod_1.z.string().min(1, 'Location is required').max(500, 'Location too long'),
    geoJson: zod_1.z.any().optional(),
    parcelSize: zod_1.z.number().positive('Parcel size must be positive'),
    coordinatePolicy: zod_1.z.boolean().default(true),
    coordinatePolicyNote: zod_1.z.string().optional(),
    totalShares: zod_1.z.number().int().min(1, 'Must have at least 1 share').max(10000, 'Too many shares').default(100),
    pricePerShare: zod_1.z.number().positive('Price per share must be positive'),
});
//# sourceMappingURL=create-listing.dto.js.map