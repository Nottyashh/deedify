"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintCollectionDto = void 0;
const zod_1 = require("zod");
exports.MintCollectionDto = zod_1.z.object({
    listingId: zod_1.z.string().cuid('Invalid listing ID'),
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name too long'),
    description: zod_1.z.string().min(1, 'Description is required').max(1000, 'Description too long'),
    image: zod_1.z.string().url('Invalid image URL').optional(),
    attributes: zod_1.z.array(zod_1.z.object({
        trait_type: zod_1.z.string().min(1, 'Trait type is required'),
        value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
    })).optional(),
});
//# sourceMappingURL=mint-collection.dto.js.map