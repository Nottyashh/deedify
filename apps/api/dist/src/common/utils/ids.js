"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdUtils = void 0;
const web3_js_1 = require("@solana/web3.js");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
class IdUtils {
    static generateListingPda(listingId) {
        const seeds = [
            Buffer.from('listing'),
            Buffer.from(listingId),
        ];
        const [pda] = web3_js_1.PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
        return pda;
    }
    static generateSharePda(listingId, shareIndex) {
        const seeds = [
            Buffer.from('share'),
            Buffer.from(listingId),
            Buffer.from(shareIndex.toString()),
        ];
        const [pda] = web3_js_1.PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
        return pda;
    }
    static generateProposalPda(proposalId) {
        const seeds = [
            Buffer.from('proposal'),
            Buffer.from(proposalId),
        ];
        const [pda] = web3_js_1.PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
        return pda;
    }
    static generateVotePda(proposalId, voterId) {
        const seeds = [
            Buffer.from('vote'),
            Buffer.from(proposalId),
            Buffer.from(voterId),
        ];
        const [pda] = web3_js_1.PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
        return pda;
    }
    static generateOrderPda(orderId) {
        const seeds = [
            Buffer.from('order'),
            Buffer.from(orderId),
        ];
        const [pda] = web3_js_1.PublicKey.findProgramAddressSync(seeds, this.PROGRAM_ID);
        return pda;
    }
    static generateId(prefix = 'id') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `${prefix}_${timestamp}_${random}`;
    }
    static generateListingId() {
        return this.generateId('listing');
    }
    static generateProposalId() {
        return this.generateId('proposal');
    }
    static generateOrderId() {
        return this.generateId('order');
    }
    static generatePayoutId() {
        return this.generateId('payout');
    }
    static generateDocumentId() {
        return this.generateId('doc');
    }
    static isValidPublicKey(address) {
        try {
            new web3_js_1.PublicKey(address);
            return true;
        }
        catch {
            return false;
        }
    }
    static isValidSignature(signature) {
        const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
        return base58Regex.test(signature) && signature.length === 88;
    }
    static generateSeed(prefix, ...args) {
        const parts = [prefix, ...args.map(arg => arg.toString())];
        return Buffer.from(parts.join('_'));
    }
    static createMetadataPda(mint) {
        const umi = (0, umi_bundle_defaults_1.createUmi)('https://api.devnet.solana.com');
        const mintUmi = (0, umi_1.publicKey)(mint.toBase58());
        return new web3_js_1.PublicKey((0, mpl_token_metadata_1.findMetadataPda)(umi, { mint: mintUmi })[0]);
    }
    static createMasterEditionPda(mint) {
        const umi = (0, umi_bundle_defaults_1.createUmi)('https://api.devnet.solana.com');
        const mintUmi = (0, umi_1.publicKey)(mint.toBase58());
        return new web3_js_1.PublicKey((0, mpl_token_metadata_1.findMasterEditionPda)(umi, { mint: mintUmi })[0]);
    }
}
exports.IdUtils = IdUtils;
IdUtils.PROGRAM_ID = new web3_js_1.PublicKey('11111111111111111111111111111111');
//# sourceMappingURL=ids.js.map