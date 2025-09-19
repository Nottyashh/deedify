import { PublicKey } from '@solana/web3.js';
export declare class IdUtils {
    private static readonly PROGRAM_ID;
    static generateListingPda(listingId: string): PublicKey;
    static generateSharePda(listingId: string, shareIndex: number): PublicKey;
    static generateProposalPda(proposalId: string): PublicKey;
    static generateVotePda(proposalId: string, voterId: string): PublicKey;
    static generateOrderPda(orderId: string): PublicKey;
    static generateId(prefix?: string): string;
    static generateListingId(): string;
    static generateProposalId(): string;
    static generateOrderId(): string;
    static generatePayoutId(): string;
    static generateDocumentId(): string;
    static isValidPublicKey(address: string): boolean;
    static isValidSignature(signature: string): boolean;
    static generateSeed(prefix: string, ...args: (string | number)[]): Buffer;
    static createMetadataPda(mint: PublicKey): PublicKey;
    static createMasterEditionPda(mint: PublicKey): PublicKey;
}
