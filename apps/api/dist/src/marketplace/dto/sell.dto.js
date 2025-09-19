"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellDto = void 0;
const zod_1 = require("zod");
exports.SellDto = zod_1.z.object({
    shareMint: zod_1.z.string().min(1, 'Share mint address is required'),
    price: zod_1.z.number().positive('Price must be positive'),
});
//# sourceMappingURL=sell.dto.js.map