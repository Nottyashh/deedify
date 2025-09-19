import { z } from 'zod';
export declare const CreateProposalDto: z.ZodObject<{
    listingId: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    startsAt: z.ZodString;
    endsAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
    listingId?: string;
    startsAt?: string;
    endsAt?: string;
}, {
    title?: string;
    description?: string;
    listingId?: string;
    startsAt?: string;
    endsAt?: string;
}>;
export declare const UpdateProposalDto: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    startsAt: z.ZodOptional<z.ZodString>;
    endsAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
    startsAt?: string;
    endsAt?: string;
}, {
    title?: string;
    description?: string;
    startsAt?: string;
    endsAt?: string;
}>;
export type CreateProposalDto = z.infer<typeof CreateProposalDto>;
export type UpdateProposalDto = z.infer<typeof UpdateProposalDto>;
