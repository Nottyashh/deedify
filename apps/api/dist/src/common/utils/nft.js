"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftService = void 0;
exports.createNftService = createNftService;
const web3_js_1 = require("@solana/web3.js");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
class NftService {
    constructor(configService, mintAuthority) {
        this.configService = configService;
        this.mintAuthority = mintAuthority;
        this.umi = (0, umi_bundle_defaults_1.createUmi)(this.configService.get('HELIUS_RPC_URL'))
            .use((0, umi_1.keypairIdentity)(this.mintAuthority))
            .use((0, mpl_token_metadata_1.mplTokenMetadata)());
    }
    async createCollectionNft(listingId, metadata) {
        const mint = (0, umi_1.generateSigner)(this.umi);
        const metadataPda = (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint: mint.publicKey });
        const metadataUri = await this.umi.uploader.uploadJson(metadata);
        await (0, mpl_token_metadata_1.createNft)(this.umi, {
            mint,
            name: metadata.name,
            symbol: 'DEEDIFY',
            uri: metadataUri,
            sellerFeeBasisPoints: (0, umi_1.percentAmount)(2.5),
            isMutable: true,
        }).sendAndConfirm(this.umi);
        return {
            mint: new web3_js_1.PublicKey(mint.publicKey),
            metadataPda: new web3_js_1.PublicKey(metadataPda[0]),
        };
    }
    async createFractionalNfts(listingId, collectionMint, totalShares, baseMetadata) {
        const results = [];
        for (let i = 1; i <= totalShares; i++) {
            const mint = (0, umi_1.generateSigner)(this.umi);
            const metadataPda = (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint: mint.publicKey });
            const shareMetadata = {
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
            const metadataUri = await this.umi.uploader.uploadJson(shareMetadata);
            await (0, mpl_token_metadata_1.createNft)(this.umi, {
                mint,
                name: shareMetadata.name,
                symbol: 'DEEDIFY',
                uri: metadataUri,
                sellerFeeBasisPoints: (0, umi_1.percentAmount)(2.5),
                isMutable: true,
                collection: {
                    key: (0, umi_1.publicKey)(collectionMint.toBase58()),
                    verified: false,
                },
            }).sendAndConfirm(this.umi);
            results.push({
                mint: new web3_js_1.PublicKey(mint.publicKey),
                metadataPda: new web3_js_1.PublicKey(metadataPda[0]),
                index: i,
            });
        }
        return results;
    }
    async updateNftMetadata(mint, metadata) {
        const mintUmi = (0, umi_1.publicKey)(mint.toBase58());
        const metadataUri = await this.umi.uploader.uploadJson(metadata);
        await (0, mpl_token_metadata_1.updateV1)(this.umi, {
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
    async fetchNftMetadata(mint) {
        try {
            const mintUmi = (0, umi_1.publicKey)(mint.toBase58());
            const metadataPda = (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint: mintUmi });
            const metadata = await (0, mpl_token_metadata_1.fetchMetadata)(this.umi, metadataPda);
            return metadata;
        }
        catch (error) {
            console.error('Failed to fetch NFT metadata:', error);
            return null;
        }
    }
    async fetchCollectionMetadata(collectionMint) {
        try {
            const mintUmi = (0, umi_1.publicKey)(collectionMint.toBase58());
            const metadataPda = (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint: mintUmi });
            const metadata = await (0, mpl_token_metadata_1.fetchMetadata)(this.umi, metadataPda);
            return metadata;
        }
        catch (error) {
            console.error('Failed to fetch collection metadata:', error);
            return null;
        }
    }
    async verifyCollectionAuthority(collectionMint, authority) {
        try {
            const mintUmi = (0, umi_1.publicKey)(collectionMint.toBase58());
            const metadataPda = (0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint: mintUmi });
            const metadata = await (0, mpl_token_metadata_1.fetchMetadata)(this.umi, metadataPda);
            return metadata.updateAuthority === authority.toBase58();
        }
        catch (error) {
            console.error('Failed to verify collection authority:', error);
            return false;
        }
    }
    getMetadataPda(mint) {
        const mintUmi = (0, umi_1.publicKey)(mint.toBase58());
        return new web3_js_1.PublicKey((0, mpl_token_metadata_1.findMetadataPda)(this.umi, { mint: mintUmi })[0]);
    }
    getMasterEditionPda(mint) {
        const mintUmi = (0, umi_1.publicKey)(mint.toBase58());
        return new web3_js_1.PublicKey((0, mpl_token_metadata_1.findMasterEditionPda)(this.umi, { mint: mintUmi })[0]);
    }
}
exports.NftService = NftService;
function createNftService(configService, mintAuthority) {
    return new NftService(configService, mintAuthority);
}
//# sourceMappingURL=nft.js.map