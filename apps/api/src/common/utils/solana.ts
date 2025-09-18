import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { Umi } from '@metaplex-foundation/umi';
import { AppConfigService } from '../config/config.service';

/**
 * Solana connection factory using Helius RPC
 */
export class SolanaService {
  private connection: Connection;
  private umi: Umi;
  private mintAuthority: Keypair;

  constructor(private configService: AppConfigService) {
    // Initialize Solana connection
    this.connection = new Connection(
      this.configService.heliusRpcUrl,
      {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
      }
    );

    // Initialize Umi for Metaplex operations
    this.umi = createUmi(this.configService.heliusRpcUrl);

    // Initialize mint authority keypair
    try {
      const secretKey = this.configService.mintAuthSecret;
      const secretKeyBytes = Buffer.from(secretKey, 'base58');
      this.mintAuthority = Keypair.fromSecretKey(secretKeyBytes);
    } catch (error) {
      throw new Error('Invalid MINT_AUTH_SECRET format. Must be base58 encoded private key.');
    }
  }

  getConnection(): Connection {
    return this.connection;
  }

  getUmi(): Umi {
    return this.umi;
  }

  getMintAuthority(): Keypair {
    return this.mintAuthority;
  }

  /**
   * Get the authority public key for Metaplex operations
   */
  getAuthorityPublicKey(): PublicKey {
    return new PublicKey(this.configService.metaplexAuthority);
  }

  /**
   * Send and confirm a transaction with retry logic
   */
  async sendAndConfirmTransaction(
    transaction: Transaction,
    signers: Keypair[] = [],
    maxRetries: number = 3
  ): Promise<string> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const signature = await this.connection.sendAndConfirmTransaction(
          transaction,
          signers,
          {
            commitment: 'confirmed',
            skipPreflight: false,
            preflightCommitment: 'confirmed',
          }
        );

        return signature;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Transaction attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw new Error(`Transaction failed after ${maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * Get account info with error handling
   */
  async getAccountInfo(publicKey: PublicKey) {
    try {
      return await this.connection.getAccountInfo(publicKey);
    } catch (error) {
      console.error('Failed to get account info:', error);
      return null;
    }
  }

  /**
   * Get balance for a wallet address
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      return await this.connection.getBalance(publicKey);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  /**
   * Check if a public key is valid
   */
  isValidPublicKey(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate a new keypair for testing
   */
  generateKeypair(): Keypair {
    return Keypair.generate();
  }
}

/**
 * Factory function to create Solana service instance
 */
export function createSolanaService(configService: AppConfigService): SolanaService {
  return new SolanaService(configService);
}