import { PublicKey, Keypair } from '@solana/web3.js';
import { ConfigService } from '@nestjs/config';
export interface NftMetadata {
    name: string;
    description: string;
    image?: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
    properties?: {
        files?: Array<{
            uri: string;
            type: string;
        }>;
        category?: string;
    };
    parcelSize?: number;
    coordinatePolicy?: boolean;
    coordinatePolicyNote?: string;
    listingId?: string;
    shareIndex?: number;
    totalShares?: number;
}
export declare class NftService {
    private configService;
    private mintAuthority;
    private umi;
    constructor(configService: ConfigService, mintAuthority: Keypair);
    createCollectionNft(listingId: string, metadata: NftMetadata): Promise<{
        mint: PublicKey;
        metadataPda: PublicKey;
    }>;
    createFractionalNfts(listingId: string, collectionMint: PublicKey, totalShares: number, baseMetadata: NftMetadata): Promise<Array<{
        mint: PublicKey;
        metadataPda: PublicKey;
        index: number;
    }>>;
    updateNftMetadata(mint: PublicKey, metadata: Partial<NftMetadata>): Promise<string>;
    fetchNftMetadata(mint: PublicKey): Promise<any>;
    fetchCollectionMetadata(collectionMint: PublicKey): Promise<any>;
    verifyCollectionAuthority(collectionMint: PublicKey, authority: PublicKey): Promise<boolean>;
    getMetadataPda(mint: PublicKey): PublicKey;
    getMasterEditionPda(mint: PublicKey): PublicKey;
}
export declare function createNftService(configService: ConfigService, mintAuthority: Keypair): NftService;
