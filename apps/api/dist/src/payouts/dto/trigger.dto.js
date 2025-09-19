"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerPayoutDto = void 0;
const zod_1 = require("zod");
exports.TriggerPayoutDto = zod_1.z.object({
    listingId: zod_1.z.string().cuid('Invalid listing ID'),
    reason: zod_1.z.enum(['DIVIDEND', 'BUYOUT'], { required_error: 'Reason is required' }),
    amount: zod_1.z.number().positive('Amount must be positive').optional(),
});
//# sourceMappingURL=trigger.dto.js.map