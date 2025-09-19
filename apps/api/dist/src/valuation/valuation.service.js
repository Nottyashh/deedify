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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ValuationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuationService = void 0;
const common_1 = require("@nestjs/common");
const listings_repository_1 = require("../listings/listings.repository");
const axios_1 = __importDefault(require("axios"));
let ValuationService = ValuationService_1 = class ValuationService {
    constructor(listingsRepository, valuationServiceUrl) {
        this.listingsRepository = listingsRepository;
        this.valuationServiceUrl = valuationServiceUrl;
        this.logger = new common_1.Logger(ValuationService_1.name);
    }
    async estimateValue(request) {
        try {
            const response = await axios_1.default.post(`${this.valuationServiceUrl}/estimate`, request, {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to get valuation from microservice:', error);
            return this.getFallbackValuation(request);
        }
    }
    async getListingValuation(listingId) {
        const listing = await this.listingsRepository.findUnique({
            where: { id: listingId },
            select: {
                id: true,
                title: true,
                locationText: true,
                parcelSize: true,
                geoJson: true,
                pricePerShare: true,
            },
        });
        if (!listing) {
            throw new common_1.BadRequestException('Listing not found');
        }
        const request = {
            location: listing.locationText,
            parcelSize: Number(listing.parcelSize),
            geoJson: listing.geoJson,
        };
        return this.estimateValue(request);
    }
    async refreshValuation(listingId) {
        const listing = await this.listingsRepository.findUnique({
            where: { id: listingId },
            select: {
                id: true,
                title: true,
                locationText: true,
                parcelSize: true,
                geoJson: true,
            },
        });
        if (!listing) {
            throw new common_1.BadRequestException('Listing not found');
        }
        const request = {
            location: listing.locationText,
            parcelSize: Number(listing.parcelSize),
            geoJson: listing.geoJson,
        };
        const valuation = await this.estimateValue(request);
        this.logger.log(`Valuation refreshed for listing ${listingId}: ${valuation.fairPricePerShare}`);
        return valuation;
    }
    async getStats() {
        try {
            const response = await axios_1.default.get(`${this.valuationServiceUrl}/stats`, {
                timeout: 10000,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to get valuation stats:', error);
            return {
                totalValuations: 0,
                averageConfidence: 0,
                lastUpdated: new Date().toISOString(),
            };
        }
    }
    getFallbackValuation(request) {
        const basePricePerAcre = 1000;
        const locationMultiplier = this.getLocationMultiplier(request.location);
        const sizeMultiplier = this.getSizeMultiplier(request.parcelSize);
        const fairPricePerShare = (basePricePerAcre * request.parcelSize * locationMultiplier * sizeMultiplier) / 100;
        return {
            fairPricePerShare: Math.round(fairPricePerShare * 100) / 100,
            confidence: 0.3,
            featuresUsed: ['location', 'parcelSize', 'fallback_rules'],
            methodology: 'fallback_rules_based',
            timestamp: new Date().toISOString(),
        };
    }
    getLocationMultiplier(location) {
        const locationLower = location.toLowerCase();
        if (locationLower.includes('california') || locationLower.includes('california')) {
            return 2.0;
        }
        else if (locationLower.includes('texas') || locationLower.includes('florida')) {
            return 1.5;
        }
        else if (locationLower.includes('new york') || locationLower.includes('massachusetts')) {
            return 1.8;
        }
        else {
            return 1.0;
        }
    }
    getSizeMultiplier(parcelSize) {
        if (parcelSize >= 100) {
            return 1.2;
        }
        else if (parcelSize >= 50) {
            return 1.1;
        }
        else if (parcelSize >= 10) {
            return 1.0;
        }
        else {
            return 0.9;
        }
    }
};
exports.ValuationService = ValuationService;
exports.ValuationService = ValuationService = ValuationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [listings_repository_1.ListingsRepository, String])
], ValuationService);
//# sourceMappingURL=valuation.service.js.map