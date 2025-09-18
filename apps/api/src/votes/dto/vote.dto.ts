import { z } from 'zod';

export const VoteDto = z.object({
  proposalId: z.string().cuid('Invalid proposal ID'),
  choice: z.enum(['YES', 'NO'], { required_error: 'Choice is required' }),
});

export const UpdateVoteDto = z.object({
  choice: z.enum(['YES', 'NO'], { required_error: 'Choice is required' }),
});

export type VoteDto = z.infer<typeof VoteDto>;
export type UpdateVoteDto = z.infer<typeof UpdateVoteDto>;