import { PublicKey } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { Umi, publicKey } from '@metaplex-foundation/umi';
import { findMetadataPda, findMasterEditionPda } from '@metaplex-foundation/mpl-token-metadata';

/**
 * Utility functions for generating deterministic PDAs and IDs
 */
export class IdUtils {
  private static readonly PROGRAM_ID = new PublicKey('11111111111111111111111111111111'); // System program as default

  /**
   * Generate a deterministic PDA for a listing
   */
  static generateListingPda(listingId: string): PublicKey {
    const seeds = [
      Buffer.from('listing'),
      Buffer.from(listingId),
    ];
    
    const [pda] = PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
    return pda;
  }

  /**
   * Generate a deterministic PDA for a share token
   */
  static generateSharePda(listingId: string, shareIndex: number): PublicKey {
    const seeds = [
      Buffer.from('share'),
      Buffer.from(listingId),
      Buffer.from(shareIndex.toString()),
    ];
    
    const [pda] = PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
    return pda;
  }

  /**
   * Generate a deterministic PDA for a proposal
   */
  static generateProposalPda(proposalId: string): PublicKey {
    const seeds = [
      Buffer.from('proposal'),
      Buffer.from(proposalId),
    ];
    
    const [pda] = PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
    return pda;
  }

  /**
   * Generate a deterministic PDA for a vote
   */
  static generateVotePda(proposalId: string, voterId: string): PublicKey {
    const seeds = [
      Buffer.from('vote'),
      Buffer.from(proposalId),
      Buffer.from(voterId),
    ];
    
    const [pda] = PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
    return pda;
  }

  /**
   * Generate a deterministic PDA for an order
   */
  static generateOrderPda(orderId: string): PublicKey {
    const seeds = [
      Buffer.from('order'),
      Buffer.from(orderId),
    ];
    
    const [pda] = PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
    return pda;
  }

  /**
   * Generate a unique ID for database records
   */
  static generateId(prefix: string = 'id'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Generate a unique listing ID
   */
  static generateListingId(): string {
    return this.generateId('listing');
  }

  /**
   * Generate a unique proposal ID
   */
  static generateProposalId(): string {
    return this.generateId('proposal');
  }

  /**
   * Generate a unique order ID
   */
  static generateOrderId(): string {
    return this.generateId('order');
  }

  /**
   * Generate a unique payout ID
   */
  static generatePayoutId(): string {
    return this.generateId('payout');
  }

  /**
   * Generate a unique document ID
   */
  static generateDocumentId(): string {
    return this.generateId('doc');
  }

  /**
   * Validate Solana public key format
   */
  static isValidPublicKey(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate Solana transaction signature format
   */
  static isValidSignature(signature: string): boolean {
    // Solana signatures are base58 encoded and typically 88 characters long
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Regex.test(signature) && signature.length === 88;
  }

  /**
   * Generate a deterministic seed for key derivation
   */
  static generateSeed(prefix: string, ...args: (string | number)[]): Buffer {
    const parts = [prefix, ...args.map(arg => arg.toString())];
    return Buffer.from(parts.join('_'));
  }

  /**
   * Create a metadata PDA using Umi
   */
  static createMetadataPda(mint: PublicKey): PublicKey {
    const umi = createUmi('https://api.devnet.solana.com'); // Dummy URL for PDA generation
    const mintUmi = publicKey(mint.toBase58());
    return new PublicKey(findMetadataPda(umi, { mint: mintUmi })[0]);
  }

  /**
   * Create a master edition PDA using Umi
   */
  static createMasterEditionPda(mint: PublicKey): PublicKey {
    const umi = createUmi('https://api.devnet.solana.com'); // Dummy URL for PDA generation
    const mintUmi = publicKey(mint.toBase58());
    return new PublicKey(findMasterEditionPda(umi, { mint: mintUmi })[0]);
  }
}