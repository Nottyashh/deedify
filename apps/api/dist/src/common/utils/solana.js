"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaService = void 0;
exports.createSolanaService = createSolanaService;
const web3_js_1 = require("@solana/web3.js");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const bs58_1 = __importDefault(require("bs58"));
class SolanaService {
    constructor(configService) {
        this.configService = configService;
        this.connection = new web3_js_1.Connection(this.configService.get('HELIUS_RPC_URL'), {
            commitment: 'confirmed',
            confirmTransactionInitialTimeout: 60000,
        });
        this.umi = (0, umi_bundle_defaults_1.createUmi)(this.configService.get('HELIUS_RPC_URL'));
        try {
            const secretKey = this.configService.get('MINT_AUTH_SECRET');
            const secretKeyBytes = bs58_1.default.decode(secretKey);
            this.mintAuthority = web3_js_1.Keypair.fromSecretKey(secretKeyBytes);
        }
        catch (error) {
            throw new Error('Invalid MINT_AUTH_SECRET format. Must be base58 encoded private key.');
        }
    }
    getConnection() {
        return this.connection;
    }
    getUmi() {
        return this.umi;
    }
    getMintAuthority() {
        return this.mintAuthority;
    }
    getAuthorityPublicKey() {
        return new web3_js_1.PublicKey(this.configService.get('METAPLEX_AUTHORITY'));
    }
    async sendAndConfirmTransaction(transaction, signers = [], maxRetries = 3) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const signature = await this.connection.sendTransaction(transaction, signers);
                await this.connection.confirmTransaction(signature, 'confirmed');
                return signature;
            }
            catch (error) {
                lastError = error;
                console.warn(`Transaction attempt ${attempt} failed:`, error.message);
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
                }
            }
        }
        throw new Error(`Transaction failed after ${maxRetries} attempts: ${lastError.message}`);
    }
    async getAccountInfo(publicKey) {
        try {
            return await this.connection.getAccountInfo(publicKey);
        }
        catch (error) {
            console.error('Failed to get account info:', error);
            return null;
        }
    }
    async getBalance(publicKey) {
        try {
            return await this.connection.getBalance(publicKey);
        }
        catch (error) {
            console.error('Failed to get balance:', error);
            return 0;
        }
    }
    isValidPublicKey(address) {
        try {
            new web3_js_1.PublicKey(address);
            return true;
        }
        catch {
            return false;
        }
    }
    generateKeypair() {
        return web3_js_1.Keypair.generate();
    }
}
exports.SolanaService = SolanaService;
function createSolanaService(configService) {
    return new SolanaService(configService);
}
//# sourceMappingURL=solana.js.map