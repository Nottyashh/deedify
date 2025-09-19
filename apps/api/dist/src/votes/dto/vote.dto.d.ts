import { z } from 'zod';
export declare const VoteDto: z.ZodObject<{
    proposalId: z.ZodString;
    choice: z.ZodEnum<["YES", "NO"]>;
}, "strip", z.ZodTypeAny, {
    choice?: "YES" | "NO";
    proposalId?: string;
}, {
    choice?: "YES" | "NO";
    proposalId?: string;
}>;
export declare const UpdateVoteDto: z.ZodObject<{
    choice: z.ZodEnum<["YES", "NO"]>;
}, "strip", z.ZodTypeAny, {
    choice?: "YES" | "NO";
}, {
    choice?: "YES" | "NO";
}>;
export type VoteDto = z.infer<typeof VoteDto>;
export type UpdateVoteDto = z.infer<typeof UpdateVoteDto>;
