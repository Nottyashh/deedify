"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NftsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsService = void 0;
const common_1 = require("@nestjs/common");
const nfts_repository_1 = require("./nfts.repository");
const listings_repository_1 = require("../listings/listings.repository");
let NftsService = NftsService_1 = class NftsService {
    constructor(nftsRepository, listingsRepository, solanaService, nftService) {
        this.nftsRepository = nftsRepository;
        this.listingsRepository = listingsRepository;
        this.solanaService = solanaService;
        this.nftService = nftService;
        this.logger = new common_1.Logger(NftsService_1.name);
    }
    async mintCollection(ownerId, data) {
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
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only mint NFTs for your own listings');
        }
        if (listing.collectionMint) {
            throw new common_1.BadRequestException('Collection NFT already exists for this listing');
        }
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
            const { mint, metadataPda } = await this.nftService.createCollectionNft(listing.id, metadata);
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
        }
        catch (error) {
            this.logger.error(`Failed to mint collection NFT for listing ${listing.id}:`, error);
            throw new common_1.BadRequestException('Failed to mint collection NFT');
        }
    }
    async mintFractions(ownerId, data) {
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
            throw new common_1.NotFoundException('Listing not found');
        }
        if (listing.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only mint NFTs for your own listings');
        }
        if (!listing.collectionMint) {
            throw new common_1.BadRequestException('Collection NFT must be minted first');
        }
        if (data.totalShares !== listing.totalShares) {
            throw new common_1.BadRequestException('Total shares must match listing configuration');
        }
        const existingFractions = await this.nftsRepository.count({
            where: { listingId: listing.id },
        });
        if (existingFractions > 0) {
            throw new common_1.BadRequestException('Fractional NFTs already exist for this listing');
        }
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
            const fractions = await this.nftService.createFractionalNfts(listing.id, new (require('@solana/web3.js').PublicKey)(listing.collectionMint), data.totalShares, baseMetadata);
            const shareTokens = await Promise.all(fractions.map((fraction, index) => this.nftsRepository.create({
                data: {
                    listingId: listing.id,
                    mintAddress: fraction.mint.toString(),
                    indexNumber: fraction.index,
                    metadataUri: `https://api.deedify.com/metadata/${fraction.mint.toString()}`,
                },
            })));
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
        }
        catch (error) {
            this.logger.error(`Failed to mint fractional NFTs for listing ${listing.id}:`, error);
            throw new common_1.BadRequestException('Failed to mint fractional NFTs');
        }
    }
    async getCollection(listingId) {
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
            throw new common_1.NotFoundException('Listing not found');
        }
        if (!listing.collectionMint) {
            throw new common_1.NotFoundException('Collection NFT not found');
        }
        try {
            const collectionMetadata = await this.nftService.fetchCollectionMetadata(new (require('@solana/web3.js').PublicKey)(listing.collectionMint));
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
        }
        catch (error) {
            this.logger.error(`Failed to fetch collection metadata for listing ${listingId}:`, error);
            throw new common_1.BadRequestException('Failed to fetch collection metadata');
        }
    }
    async getFractions(listingId, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const listing = await this.listingsRepository.findUnique({
            where: { id: listingId },
            select: { id: true, title: true },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
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
    async getMetadata(mintAddress) {
        try {
            const mint = new (require('@solana/web3.js').PublicKey)(mintAddress);
            const metadata = await this.nftService.fetchNftMetadata(mint);
            if (!metadata) {
                throw new common_1.NotFoundException('NFT not found');
            }
            return metadata;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to fetch NFT metadata for ${mintAddress}:`, error);
            throw new common_1.BadRequestException('Failed to fetch NFT metadata');
        }
    }
    async getOwnedNfts(walletAddress, query) {
        const { page, limit, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
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
    async verifyCollection(listingId) {
        const listing = await this.listingsRepository.findUnique({
            where: { id: listingId },
            select: {
                id: true,
                title: true,
                collectionMint: true,
            },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        if (!listing.collectionMint) {
            throw new common_1.NotFoundException('Collection NFT not found');
        }
        try {
            const isValid = await this.nftService.verifyCollectionAuthority(new (require('@solana/web3.js').PublicKey)(listing.collectionMint), this.solanaService.getAuthorityPublicKey());
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
        }
        catch (error) {
            this.logger.error(`Failed to verify collection for listing ${listingId}:`, error);
            throw new common_1.BadRequestException('Failed to verify collection');
        }
    }
    async getStats(listingId) {
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
            throw new common_1.NotFoundException('Listing not found');
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
};
exports.NftsService = NftsService;
exports.NftsService = NftsService = NftsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nfts_repository_1.NftsRepository,
        listings_repository_1.ListingsRepository, Object, Object])
], NftsService);
//# sourceMappingURL=nfts.service.js.map