"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProposalDto = exports.CreateProposalDto = void 0;
const zod_1 = require("zod");
exports.CreateProposalDto = zod_1.z.object({
    listingId: zod_1.z.string().cuid('Invalid listing ID'),
    title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: zod_1.z.string().min(1, 'Description is required').max(2000, 'Description too long'),
    startsAt: zod_1.z.string().datetime('Invalid start date'),
    endsAt: zod_1.z.string().datetime('Invalid end date'),
});
exports.UpdateProposalDto = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    description: zod_1.z.string().min(1, 'Description is required').max(2000, 'Description too long').optional(),
    startsAt: zod_1.z.string().datetime('Invalid start date').optional(),
    endsAt: zod_1.z.string().datetime('Invalid end date').optional(),
});
//# sourceMappingURL=proposal.dto.js.map