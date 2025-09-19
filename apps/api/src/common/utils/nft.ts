import { PublicKey, Keypair } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  Umi,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey
} from '@metaplex-foundation/umi';
import {
  createNft,
  findMetadataPda,
  findMasterEditionPda,
  mplTokenMetadata,
  updateV1,
  fetchMetadata
} from '@metaplex-foundation/mpl-token-metadata';
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
  // Deedify-specific fields
  parcelSize?: number;
  coordinatePolicy?: boolean;
  coordinatePolicyNote?: string;
  listingId?: string;
  shareIndex?: number;
  totalShares?: number;
}

export class NftService {
  private umi: Umi;

  constructor(
    private configService: ConfigService,
    private mintAuthority: Keypair
  ) {
    this.umi = createUmi(this.configService.get('HELIUS_RPC_URL'))
      .use(keypairIdentity(this.mintAuthority as any))
      .use(mplTokenMetadata());
  }

  /**
   * Create a collection NFT for a land listing
   */
  async createCollectionNft(
    listingId: string,
    metadata: NftMetadata
  ): Promise<{ mint: PublicKey; metadataPda: PublicKey }> {
    const mint = generateSigner(this.umi);
    const metadataPda = findMetadataPda(this.umi, { mint: mint.publicKey });

    // Upload metadata to IPFS
    const metadataUri = await this.umi.uploader.uploadJson(metadata);

    await createNft(this.umi, {
      mint,
      name: metadata.name,
      symbol: 'DEEDIFY',
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(2.5), // 2.5% royalty
      isMutable: true,
    }).sendAndConfirm(this.umi);

    return {
      mint: new PublicKey(mint.publicKey),
      metadataPda: new PublicKey(metadataPda[0]),
    };
  }

  /**
   * Create fractional NFTs for a listing
   */
  async createFractionalNfts(
    listingId: string,
    collectionMint: PublicKey,
    totalShares: number,
    baseMetadata: NftMetadata
  ): Promise<Array<{ mint: PublicKey; metadataPda: PublicKey; index: number }>> {
    const results = [];

    for (let i = 1; i <= totalShares; i++) {
      const mint = generateSigner(this.umi);
      const metadataPda = findMetadataPda(this.umi, { mint: mint.publicKey });

      // Create metadata for this specific share
      const shareMetadata: NftMetadata = {
        ...baseMetadata,
        name: `${baseMetadata.name} - Share ${i}`,
        shareIndex: i,
        totalShares,
        attributes: [
          ...(baseMetadata.attributes || []),
          { trait_type: 'Share Number', value: i },
          { trait_type: 'Total Shares', value: totalShares },
          { trait_type: 'Listing ID', value: listingId },
        ],
      };

      // Upload metadata
      const metadataUri = await this.umi.uploader.uploadJson(shareMetadata);

      // Create the NFT
      await createNft(this.umi, {
        mint,
        name: shareMetadata.name,
        symbol: 'DEEDIFY',
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(2.5),
        isMutable: true,
        collection: {
          key: publicKey(collectionMint.toBase58()),
          verified: false, // Will be verified later
        },
      }).sendAndConfirm(this.umi);

      results.push({
        mint: new PublicKey(mint.publicKey),
        metadataPda: new PublicKey(metadataPda[0]),
        index: i,
      });
    }

    return results;
  }

  /**
   * Update NFT metadata
   */
  async updateNftMetadata(
    mint: PublicKey,
    metadata: Partial<NftMetadata>
  ): Promise<string> {
    const mintUmi = publicKey(mint.toBase58());

    // Upload updated metadata
    const metadataUri = await this.umi.uploader.uploadJson(metadata);

    // Update the NFT
    await updateV1(this.umi, {
      mint: mintUmi,
      data: {
        name: metadata.name,
        symbol: 'DEEDIFY',
        uri: metadataUri,
        sellerFeeBasisPoints: 0,
        creators: []
      },
    }).sendAndConfirm(this.umi);

    return metadataUri;
  }

  /**
   * Fetch NFT metadata
   */
  async fetchNftMetadata(mint: PublicKey): Promise<any> {
    try {
      const mintUmi = publicKey(mint.toBase58());
      const metadataPda = findMetadataPda(this.umi, { mint: mintUmi });
      const metadata = await fetchMetadata(this.umi, metadataPda);
      return metadata;
    } catch (error) {
      console.error('Failed to fetch NFT metadata:', error);
      return null;
    }
  }

  /**
   * Fetch collection metadata
   */
  async fetchCollectionMetadata(collectionMint: PublicKey): Promise<any> {
    try {
      const mintUmi = publicKey(collectionMint.toBase58());
      const metadataPda = findMetadataPda(this.umi, { mint: mintUmi });
      const metadata = await fetchMetadata(this.umi, metadataPda);
      return metadata;
    } catch (error) {
      console.error('Failed to fetch collection metadata:', error);
      return null;
    }
  }

  /**
   * Verify collection authority
   */
  async verifyCollectionAuthority(
    collectionMint: PublicKey,
    authority: PublicKey
  ): Promise<boolean> {
    try {
      const mintUmi = publicKey(collectionMint.toBase58());
      const metadataPda = findMetadataPda(this.umi, { mint: mintUmi });
      const metadata = await fetchMetadata(this.umi, metadataPda);
      return metadata.updateAuthority === authority.toBase58();
    } catch (error) {
      console.error('Failed to verify collection authority:', error);
      return false;
    }
  }

  /**
   * Get metadata PDA for a mint
   */
  getMetadataPda(mint: PublicKey): PublicKey {
    const mintUmi = publicKey(mint.toBase58());
    return new PublicKey(findMetadataPda(this.umi, { mint: mintUmi })[0]);
  }

  /**
   * Get master edition PDA for a mint
   */
  getMasterEditionPda(mint: PublicKey): PublicKey {
    const mintUmi = publicKey(mint.toBase58());
    return new PublicKey(findMasterEditionPda(this.umi, { mint: mintUmi })[0]);
  }
}

/**
 * Factory function to create NFT service
 */
export function createNftService(
  configService: ConfigService,
  mintAuthority: Keypair
): NftService {
  return new NftService(configService, mintAuthority);
}