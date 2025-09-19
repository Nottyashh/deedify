import { ListingsRepository } from '../listings/listings.repository';
export interface ValuationRequest {
    location: string;
    parcelSize: number;
    geoJson?: any;
    comps?: Array<{
        location: string;
        size: number;
        price: number;
    }>;
    soilScore?: number;
    infraScore?: number;
}
export interface ValuationResponse {
    fairPricePerShare: number;
    confidence: number;
    featuresUsed: string[];
    methodology: string;
    timestamp: string;
}
export declare class ValuationService {
    private readonly listingsRepository;
    private readonly valuationServiceUrl;
    private readonly logger;
    constructor(listingsRepository: ListingsRepository, valuationServiceUrl: string);
    estimateValue(request: ValuationRequest): Promise<ValuationResponse>;
    getListingValuation(listingId: string): Promise<ValuationResponse>;
    refreshValuation(listingId: string): Promise<ValuationResponse>;
    getStats(): Promise<any>;
    private getFallbackValuation;
    private getLocationMultiplier;
    private getSizeMultiplier;
}
