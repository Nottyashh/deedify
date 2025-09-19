"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceModule = void 0;
const common_1 = require("@nestjs/common");
const marketplace_controller_1 = require("./marketplace.controller");
const marketplace_service_1 = require("./marketplace.service");
const marketplace_repository_1 = require("./marketplace.repository");
const prisma_module_1 = require("../common/prisma/prisma.module");
const config_service_1 = require("../common/config/config.service");
let MarketplaceModule = class MarketplaceModule {
};
exports.MarketplaceModule = MarketplaceModule;
exports.MarketplaceModule = MarketplaceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [marketplace_controller_1.MarketplaceController],
        providers: [
            marketplace_service_1.MarketplaceService,
            marketplace_repository_1.MarketplaceRepository,
            {
                provide: 'SOLANA_SERVICE',
                useFactory: (configService) => {
                    const { createSolanaService } = require('../common/utils/solana');
                    return createSolanaService(configService);
                },
                inject: [config_service_1.AppConfigService],
            },
        ],
        exports: [marketplace_service_1.MarketplaceService, marketplace_repository_1.MarketplaceRepository],
    })
], MarketplaceModule);
//# sourceMappingURL=marketplace.module.js.map