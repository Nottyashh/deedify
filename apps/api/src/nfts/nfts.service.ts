import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { NftsRepository } from './nfts.repository';
import { ListingsRepository } from '../listings/listings.repository';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class NftsService {
  private readonly logger = new Logger(NftsService.name);

  constructor(
    private readonly nftsRepository: NftsRepository,
    private readonly listingsRepository: ListingsRepository,
    private readonly solanaService: any,
    private readonly nftService: any,
  ) {}

  async mintCollection(ownerId: string, data: {
    listingId: string;
    name: string;
    description: string;
    image?: string;
    attributes?: Array<{ trait_type: string; value: string | number }>;
  }) {
    // Verify listing exists and user owns it
    const listing = await this.listingsRepository.findUnique({
      where: { id: data.listingId },
      select: {
        id: true,
        title: true,
        ownerId: true,
        collectionMint: true,
        parcelSize: true,
        coordinatePolicy: true,
        coordinatePolicyNote: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('You can only mint NFTs for your own listings');
    }

    if (listing.collectionMint) {
      throw new BadRequestException('Collection NFT already exists for this listing');
    }

    // Create collection metadata
    const metadata = {
      name: data.name,
      description: data.description,
      image: data.image,
      attributes: [
        ...(data.attributes || []),
        { trait_type: 'Parcel Size (acres)', value: listing.parcelSize },
        { trait_type: 'Coordinate Policy', value: listing.coordinatePolicy ? 'Fractional' : 'Exact' },
        { trait_type: 'Policy Note', value: listing.coordinatePolicyNote },
        { trait_type: 'Listing ID', value: listing.id },
      ],
      parcelSize: listing.parcelSize,
      coordinatePolicy: listing.coordinatePolicy,
      coordinatePolicyNote: listing.coordinatePolicyNote,
      listingId: listing.id,
    };

    try {
      // Mint collection NFT on Solana
      const { mint, metadataPda } = await this.nftService.createCollectionNft(
        listing.id,
        metadata
      );

      // Update listing with collection mint
      await this.listingsRepository.update({
        where: { id: listing.id },
        data: { collectionMint: mint.toString() },
      });

      this.logger.log(`Collection NFT minted for listing ${listing.id}: ${mint.toString()}`);

      return {
        listingId: listing.id,
        collectionMint: mint.toString(),
        metadataPda: metadataPda.toString(),
        metadata,
      };
    } catch (error) {
      this.logger.error(`Failed to mint collection NFT for listing ${listing.id}:`, error);
      throw new BadRequestException('Failed to mint collection NFT');
    }
  }

  async mintFractions(ownerId: string, data: {
    listingId: string;
    totalShares: number;
    baseName: string;
    baseDescription: string;
    image?: string;
    attributes?: Array<{ trait_type: string; value: string | number }>;
  }) {
    // Verify listing exists and user owns it
    const listing = await this.listingsRepository.findUnique({
      where: { id: data.listingId },
      select: {
        id: true,
        title: true,
        ownerId: true,
        collectionMint: true,
        parcelSize: true,
        coordinatePolicy: true,
        coordinatePolicyNote: true,
        totalShares: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException('You can only mint NFTs for your own listings');
    }

    if (!listing.collectionMint) {
      throw new BadRequestException('Collection NFT must be minted first');
    }

    if (data.totalShares !== listing.totalShares) {
      throw new BadRequestException('Total shares must match listing configuration');
    }

    // Check if fractions already exist
    const existingFractions = await this.nftsRepository.count({
      where: { listingId: listing.id },
    });

    if (existingFractions > 0) {
      throw new BadRequestException('Fractional NFTs already exist for this listing');
    }

    // Create base metadata for fractions
    const baseMetadata = {
      name: data.baseName,
      description: data.baseDescription,
      image: data.image,
      attributes: [
        ...(data.attributes || []),
        { trait_type: 'Parcel Size (acres)', value: listing.parcelSize },
        { trait_type: 'Coordinate Policy', value: listing.coordinatePolicy ? 'Fractional' : 'Exact' },
        { trait_type: 'Policy Note', value: listing.coordinatePolicyNote },
        { trait_type: 'Listing ID', value: listing.id },
        { trait_type: 'Total Shares', value: listing.totalShares },
      ],
      parcelSize: listing.parcelSize,
      coordinatePolicy: listing.coordinatePolicy,
      coordinatePolicyNote: listing.coordinatePolicyNote,
      listingId: listing.id,
      totalShares: listing.totalShares,
    };

    try {
      // Mint fractional NFTs on Solana
      const fractions = await this.nftService.createFractionalNfts(
        listing.id,
        new (require('@solana/web3.js').PublicKey)(listing.collectionMint),
        data.totalShares,
        baseMetadata
      );

      // Store fraction data in database
      const shareTokens = await Promise.all(
        fractions.map((fraction, index) =>
          this.nftsRepository.create({
            data: {
              listingId: listing.id,
              mintAddress: fraction.mint.toString(),
              indexNumber: fraction.index,
              metadataUri: `https://api.deedify.com/metadata/${fraction.mint.toString()}`,
            },
          })
        )
      );

      this.logger.log(`Minted ${fractions.length} fractional NFTs for listing ${listing.id}`);

      return {
        listingId: listing.id,
        totalShares: fractions.length,
        shareTokens: shareTokens.map(token => ({
          id: token.id,
          mintAddress: token.mintAddress,
          indexNumber: token.indexNumber,
          metadataUri: token.metadataUri,
        })),
      };
    } catch (error) {
      this.logger.error(`Failed to mint fractional NFTs for listing ${listing.id}:`, error);
      throw new BadRequestException('Failed to mint fractional NFTs');
    }
  }

  async getCollection(listingId: string) {
    const listing = await this.listingsRepository.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        collectionMint: true,
        parcelSize: true,
        coordinatePolicy: true,
        coordinatePolicyNote: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!listing.collectionMint) {
      throw new NotFoundException('Collection NFT not found');
    }

    try {
      // Fetch collection metadata from Solana
      const collectionMetadata = await this.nftService.fetchCollectionMetadata(
        new (require('@solana/web3.js').PublicKey)(listing.collectionMint)
      );

      return {
        listing: {
          id: listing.id,
          title: listing.title,
        },
        collection: {
          mint: listing.collectionMint,
          metadata: collectionMetadata,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to fetch collection metadata for listing ${listingId}:`, error);
      throw new BadRequestException('Failed to fetch collection metadata');
    }
  }

  async getFractions(listingId: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const listing = await this.listingsRepository.findUnique({
      where: { id: listingId },
      select: { id: true, title: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const [shareTokens, total] = await Promise.all([
      this.nftsRepository.findMany({
        where: { listingId },
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder } : { indexNumber: 'asc' },
        select: {
          id: true,
          mintAddress: true,
          indexNumber: true,
          metadataUri: true,
        },
      }),
      this.nftsRepository.count({ where: { listingId } }),
    ]);

    return {
      data: shareTokens,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getMetadata(mintAddress: string) {
    try {
      const mint = new (require('@solana/web3.js').PublicKey)(mintAddress);
      const metadata = await this.nftService.fetchNftMetadata(mint);

      if (!metadata) {
        throw new NotFoundException('NFT not found');
      }

      return metadata;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch NFT metadata for ${mintAddress}:`, error);
      throw new BadRequestException('Failed to fetch NFT metadata');
    }
  }

  async getOwnedNfts(walletAddress: string, query: PaginationDto): Promise<PaginatedResponse<any>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // This would typically query on-chain data via Helius
    // For now, we'll return a placeholder response
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  async verifyCollection(listingId: string) {
    const listing = await this.listingsRepository.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        collectionMint: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (!listing.collectionMint) {
      throw new NotFoundException('Collection NFT not found');
    }

    try {
      const isValid = await this.nftService.verifyCollectionAuthority(
        new (require('@solana/web3.js').PublicKey)(listing.collectionMint),
        this.solanaService.getAuthorityPublicKey()
      );

      return {
        listing: {
          id: listing.id,
          title: listing.title,
        },
        collection: {
          mint: listing.collectionMint,
          verified: isValid,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to verify collection for listing ${listingId}:`, error);
      throw new BadRequestException('Failed to verify collection');
    }
  }

  async getStats(listingId: string) {
    const listing = await this.listingsRepository.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        collectionMint: true,
        totalShares: true,
        _count: {
          select: {
            shareTokens: true,
            orders: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return {
      listing: {
        id: listing.id,
        title: listing.title,
      },
      stats: {
        totalShares: listing.totalShares,
        mintedShares: listing._count.shareTokens,
        pendingShares: listing.totalShares - listing._count.shareTokens,
        totalOrders: listing._count.orders,
        hasCollection: !!listing.collectionMint,
      },
    };
  }
}