"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVoteDto = exports.VoteDto = void 0;
const zod_1 = require("zod");
exports.VoteDto = zod_1.z.object({
    proposalId: zod_1.z.string().cuid('Invalid proposal ID'),
    choice: zod_1.z.enum(['YES', 'NO'], { required_error: 'Choice is required' }),
});
exports.UpdateVoteDto = zod_1.z.object({
    choice: zod_1.z.enum(['YES', 'NO'], { required_error: 'Choice is required' }),
});
//# sourceMappingURL=vote.dto.js.map