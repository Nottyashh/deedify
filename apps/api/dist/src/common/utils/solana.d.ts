import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { Umi } from '@metaplex-foundation/umi';
import { ConfigService } from '@nestjs/config';
export declare class SolanaService {
    private configService;
    private connection;
    private umi;
    private mintAuthority;
    constructor(configService: ConfigService);
    getConnection(): Connection;
    getUmi(): Umi;
    getMintAuthority(): Keypair;
    getAuthorityPublicKey(): PublicKey;
    sendAndConfirmTransaction(transaction: Transaction, signers?: Keypair[], maxRetries?: number): Promise<string>;
    getAccountInfo(publicKey: PublicKey): Promise<import("@solana/web3.js").AccountInfo<Buffer<ArrayBufferLike>>>;
    getBalance(publicKey: PublicKey): Promise<number>;
    isValidPublicKey(address: string): boolean;
    generateKeypair(): Keypair;
}
export declare function createSolanaService(configService: ConfigService): SolanaService;
