import { z } from 'zod';
import { ValuationService } from './valuation.service';
declare const EstimateValueDto: z.ZodObject<{
    location: z.ZodString;
    parcelSize: z.ZodNumber;
    geoJson: z.ZodOptional<z.ZodAny>;
    comps: z.ZodOptional<z.ZodArray<z.ZodObject<{
        location: z.ZodString;
        size: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        price?: number;
        location?: string;
        size?: number;
    }, {
        price?: number;
        location?: string;
        size?: number;
    }>, "many">>;
    soilScore: z.ZodOptional<z.ZodNumber>;
    infraScore: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    geoJson?: any;
    parcelSize?: number;
    location?: string;
    comps?: {
        price?: number;
        location?: string;
        size?: number;
    }[];
    soilScore?: number;
    infraScore?: number;
}, {
    geoJson?: any;
    parcelSize?: number;
    location?: string;
    comps?: {
        price?: number;
        location?: string;
        size?: number;
    }[];
    soilScore?: number;
    infraScore?: number;
}>;
type EstimateValueDto = z.infer<typeof EstimateValueDto>;
export declare class ValuationController {
    private readonly valuationService;
    constructor(valuationService: ValuationService);
    estimateValue(estimateValueDto: EstimateValueDto): Promise<import("./valuation.service").ValuationResponse>;
    getListingValuation(listingId: string): Promise<import("./valuation.service").ValuationResponse>;
    refreshValuation(listingId: string): Promise<import("./valuation.service").ValuationResponse>;
    getStats(): Promise<any>;
}
export {};
