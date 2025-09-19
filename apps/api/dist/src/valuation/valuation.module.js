"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuationModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const valuation_controller_1 = require("./valuation.controller");
const valuation_service_1 = require("./valuation.service");
let ValuationModule = class ValuationModule {
};
exports.ValuationModule = ValuationModule;
exports.ValuationModule = ValuationModule = __decorate([
    (0, common_1.Module)({
        controllers: [valuation_controller_1.ValuationController],
        providers: [
            valuation_service_1.ValuationService,
            {
                provide: 'VALUATION_SERVICE_URL',
                useFactory: (configService) => {
                    return configService.get('VALUATION_SERVICE_URL', 'http://localhost:3001');
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [valuation_service_1.ValuationService],
    })
], ValuationModule);
//# sourceMappingURL=valuation.module.js.map