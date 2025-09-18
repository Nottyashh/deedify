import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ListingsRepository } from '../listings/listings.repository';
import axios from 'axios';

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

@Injectable()
export class ValuationService {
  private readonly logger = new Logger(ValuationService.name);

  constructor(
    private readonly listingsRepository: ListingsRepository,
    private readonly valuationServiceUrl: string,
  ) {}

  async estimateValue(request: ValuationRequest): Promise<ValuationResponse> {
    try {
      // Call the valuation microservice
      const response = await axios.post(`${this.valuationServiceUrl}/estimate`, request, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get valuation from microservice:', error);
      
      // Fallback to basic estimation
      return this.getFallbackValuation(request);
    }
  }

  async getListingValuation(listingId: string): Promise<ValuationResponse> {
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
      throw new BadRequestException('Listing not found');
    }

    const request: ValuationRequest = {
      location: listing.locationText,
      parcelSize: Number(listing.parcelSize),
      geoJson: listing.geoJson,
    };

    return this.estimateValue(request);
  }

  async refreshValuation(listingId: string): Promise<ValuationResponse> {
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
      throw new BadRequestException('Listing not found');
    }

    const request: ValuationRequest = {
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
      // Get stats from valuation microservice
      const response = await axios.get(`${this.valuationServiceUrl}/stats`, {
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get valuation stats:', error);
      
      return {
        totalValuations: 0,
        averageConfidence: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  private getFallbackValuation(request: ValuationRequest): ValuationResponse {
    // Basic fallback valuation based on simple rules
    const basePricePerAcre = 1000; // $1000 per acre base price
    const locationMultiplier = this.getLocationMultiplier(request.location);
    const sizeMultiplier = this.getSizeMultiplier(request.parcelSize);
    
    const fairPricePerShare = (basePricePerAcre * request.parcelSize * locationMultiplier * sizeMultiplier) / 100;

    return {
      fairPricePerShare: Math.round(fairPricePerShare * 100) / 100,
      confidence: 0.3, // Low confidence for fallback
      featuresUsed: ['location', 'parcelSize', 'fallback_rules'],
      methodology: 'fallback_rules_based',
      timestamp: new Date().toISOString(),
    };
  }

  private getLocationMultiplier(location: string): number {
    // Simple location-based multiplier
    const locationLower = location.toLowerCase();
    
    if (locationLower.includes('california') || locationLower.includes('california')) {
      return 2.0;
    } else if (locationLower.includes('texas') || locationLower.includes('florida')) {
      return 1.5;
    } else if (locationLower.includes('new york') || locationLower.includes('massachusetts')) {
      return 1.8;
    } else {
      return 1.0;
    }
  }

  private getSizeMultiplier(parcelSize: number): number {
    // Size-based multiplier (larger parcels get better per-acre pricing)
    if (parcelSize >= 100) {
      return 1.2;
    } else if (parcelSize >= 50) {
      return 1.1;
    } else if (parcelSize >= 10) {
      return 1.0;
    } else {
      return 0.9;
    }
  }
}