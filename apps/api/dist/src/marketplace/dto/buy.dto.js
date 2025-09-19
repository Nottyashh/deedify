"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyDto = void 0;
const zod_1 = require("zod");
exports.BuyDto = zod_1.z.object({
    shareMint: zod_1.z.string().min(1, 'Share mint address is required'),
    buyerWallet: zod_1.z.string().min(1, 'Buyer wallet address is required'),
});
//# sourceMappingURL=buy.dto.js.map