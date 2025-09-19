"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftsModule = void 0;
const common_1 = require("@nestjs/common");
const nfts_controller_1 = require("./nfts.controller");
const nfts_service_1 = require("./nfts.service");
const nfts_repository_1 = require("./nfts.repository");
const prisma_module_1 = require("../common/prisma/prisma.module");
const config_service_1 = require("../common/config/config.service");
let NftsModule = class NftsModule {
};
exports.NftsModule = NftsModule;
exports.NftsModule = NftsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [nfts_controller_1.NftsController],
        providers: [
            nfts_service_1.NftsService,
            nfts_repository_1.NftsRepository,
            {
                provide: 'SOLANA_SERVICE',
                useFactory: (configService) => {
                    const { createSolanaService } = require('../common/utils/solana');
                    return createSolanaService(configService);
                },
                inject: [config_service_1.AppConfigService],
            },
            {
                provide: 'NFT_SERVICE',
                useFactory: (configService, solanaService) => {
                    const { createNftService } = require('../common/utils/nft');
                    return createNftService(configService, solanaService.getMintAuthority());
                },
                inject: [config_service_1.AppConfigService, 'SOLANA_SERVICE'],
            },
        ],
        exports: [nfts_service_1.NftsService, nfts_repository_1.NftsRepository],
    })
], NftsModule);
//# sourceMappingURL=nfts.module.js.map