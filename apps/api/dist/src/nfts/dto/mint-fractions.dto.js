"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintFractionsDto = void 0;
const zod_1 = require("zod");
exports.MintFractionsDto = zod_1.z.object({
    listingId: zod_1.z.string().cuid('Invalid listing ID'),
    totalShares: zod_1.z.number().int().min(1, 'Must have at least 1 share').max(10000, 'Too many shares'),
    baseName: zod_1.z.string().min(1, 'Base name is required').max(100, 'Base name too long'),
    baseDescription: zod_1.z.string().min(1, 'Base description is required').max(1000, 'Base description too long'),
    image: zod_1.z.string().url('Invalid image URL').optional(),
    attributes: zod_1.z.array(zod_1.z.object({
        trait_type: zod_1.z.string().min(1, 'Trait type is required'),
        value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
    })).optional(),
});
//# sourceMappingURL=mint-fractions.dto.js.map