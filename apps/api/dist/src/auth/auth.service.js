"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../common/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (data.walletAddress) {
            const isValidWallet = this.isValidSolanaAddress(data.walletAddress);
            if (!isValidWallet) {
                throw new common_1.BadRequestException('Invalid Solana wallet address');
            }
            const existingWallet = await this.prisma.user.findUnique({
                where: { walletAddress: data.walletAddress },
            });
            if (existingWallet) {
                throw new common_1.ConflictException('Wallet address is already in use');
            }
        }
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                role: data.role,
                walletAddress: data.walletAddress,
            },
            select: {
                id: true,
                email: true,
                role: true,
                walletAddress: true,
                kycStatus: true,
                createdAt: true,
            },
        });
        this.logger.log(`New user registered: ${user.email} (${user.role})`);
        return {
            user,
            message: 'User registered successfully. Please verify your email.',
        };
    }
    async login(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
            select: {
                id: true,
                email: true,
                role: true,
                walletAddress: true,
                kycStatus: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            walletAddress: user.walletAddress,
        };
        const token = this.jwtService.sign(payload);
        this.logger.log(`User logged in: ${user.email}`);
        return {
            user,
            accessToken: token,
            tokenType: 'Bearer',
            expiresIn: '7d',
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                walletAddress: true,
                kycStatus: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateProfile(userId, data) {
        if (data.walletAddress) {
            const isValidWallet = this.isValidSolanaAddress(data.walletAddress);
            if (!isValidWallet) {
                throw new common_1.BadRequestException('Invalid Solana wallet address');
            }
            const existingWallet = await this.prisma.user.findFirst({
                where: {
                    walletAddress: data.walletAddress,
                    id: { not: userId },
                },
            });
            if (existingWallet) {
                throw new common_1.ConflictException('Wallet address is already in use');
            }
        }
        const user = await this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                role: true,
                walletAddress: true,
                kycStatus: true,
                updatedAt: true,
            },
        });
        this.logger.log(`User profile updated: ${user.email}`);
        return user;
    }
    async refreshToken(user) {
        const payload = {
            sub: user.sub,
            email: user.email,
            role: user.role,
            walletAddress: user.walletAddress,
        };
        const token = this.jwtService.sign(payload);
        return {
            accessToken: token,
            tokenType: 'Bearer',
            expiresIn: '7d',
        };
    }
    async logout(userId) {
        this.logger.log(`User logged out: ${userId}`);
        return {
            message: 'Logout successful',
        };
    }
    async verifySupabaseUser(supabaseUser) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: supabaseUser.email },
        });
        if (existingUser) {
            return existingUser;
        }
        const user = await this.prisma.user.create({
            data: {
                email: supabaseUser.email,
                role: 'INVESTOR',
                walletAddress: null,
                kycStatus: 'PENDING',
            },
        });
        this.logger.log(`User created from Supabase: ${user.email}`);
        return user;
    }
    isValidSolanaAddress(address) {
        try {
            return address.length >= 32 && address.length <= 44;
        }
        catch {
            return false;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map