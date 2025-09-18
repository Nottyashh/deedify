import { PublicKey, Keypair } from '@solana/web3.js';
import { 
  createUmi, 
  Umi,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from '@metaplex-foundation/umi-bundle-defaults';
import {
  createNft,
  createCollectionNft,
  findMetadataPda,
  findMasterEditionPda,
  findCollectionAuthorityRecordPda,
  mplTokenMetadata,
  updateV1,
  fetchNft,
  fetchCollection,
} from '@metaplex-foundation/mpl-token-metadata';
import { bundledUploader } from '@metaplex-foundation/umi-uploader-bundled-uploader';
import { AppConfigService } from '../config/config.service';

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
    private configService: AppConfigService,
    private mintAuthority: Keypair
  ) {
    this.umi = createUmi(this.configService.heliusRpcUrl)
      .use(keypairIdentity(this.mintAuthority))
      .use(bundledUploader())
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
    const masterEditionPda = findMasterEditionPda(this.umi, { mint: mint.publicKey });

    // Upload metadata to IPFS
    const metadataUri = await this.umi.uploader.uploadJson(metadata);

    await createCollectionNft(this.umi, {
      mint,
      name: metadata.name,
      symbol: 'DEEDIFY',
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(2.5), // 2.5% royalty
      isMutable: true,
    }).sendAndConfirm(this.umi);

    return {
      mint: mint.publicKey,
      metadataPda,
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
          key: collectionMint,
          verified: false, // Will be verified later
        },
      }).sendAndConfirm(this.umi);

      results.push({
        mint: mint.publicKey,
        metadataPda,
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
    const metadataPda = findMetadataPda(this.umi, { mint });

    // Upload updated metadata
    const metadataUri = await this.umi.uploader.uploadJson(metadata);

    // Update the NFT
    await updateV1(this.umi, {
      mint,
      data: {
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
      },
    }).sendAndConfirm(this.umi);

    return metadataUri;
  }

  /**
   * Fetch NFT metadata
   */
  async fetchNftMetadata(mint: PublicKey): Promise<any> {
    try {
      const nft = await fetchNft(this.umi, mint);
      return nft;
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
      const collection = await fetchCollection(this.umi, collectionMint);
      return collection;
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
      const collection = await fetchCollection(this.umi, collectionMint);
      return collection.updateAuthority === authority;
    } catch (error) {
      console.error('Failed to verify collection authority:', error);
      return false;
    }
  }

  /**
   * Get metadata PDA for a mint
   */
  getMetadataPda(mint: PublicKey): PublicKey {
    return findMetadataPda(this.umi, { mint }).publicKey;
  }

  /**
   * Get master edition PDA for a mint
   */
  getMasterEditionPda(mint: PublicKey): PublicKey {
    return findMasterEditionPda(this.umi, { mint }).publicKey;
  }

  /**
   * Get collection authority record PDA
   */
  getCollectionAuthorityRecordPda(
    collectionMint: PublicKey,
    authority: PublicKey
  ): PublicKey {
    return findCollectionAuthorityRecordPda(this.umi, {
      mint: collectionMint,
      collectionAuthority: authority,
    }).publicKey;
  }
}

/**
 * Factory function to create NFT service
 */
export function createNftService(
  configService: AppConfigService,
  mintAuthority: Keypair
): NftService {
  return new NftService(configService, mintAuthority);
}