import { normalizeLocation, normalizeParcelSize } from '../utils/normalize';

export interface ValuationInput {
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

export interface ValuationOutput {
  price: number;
  confidence: number;
  reasoning: string[];
}

export class RulesBasedModel {
  private stats = {
    totalPredictions: 0,
    averageConfidence: 0,
    lastPrediction: null as Date | null,
  };

  async predict(input: ValuationInput): Promise<ValuationOutput> {
    const reasoning: string[] = [];
    let basePrice = 0;
    let confidence = 0.5;

    // Base price per acre by state/region
    const stateMultipliers = this.getStateMultipliers();
    const normalizedLocation = normalizeLocation(input.location);
    const stateMultiplier = this.getStateMultiplier(normalizedLocation, stateMultipliers);
    
    basePrice = 1000 * stateMultiplier; // $1000 base price per acre
    reasoning.push(`Base price: $${basePrice} per acre (${normalizedLocation})`);

    // Parcel size adjustments
    const sizeMultiplier = this.getSizeMultiplier(input.parcelSize);
    basePrice *= sizeMultiplier;
    reasoning.push(`Size adjustment: ${(sizeMultiplier - 1) * 100}% (${input.parcelSize} acres)`);

    // Comparable sales adjustment
    if (input.comps && input.comps.length > 0) {
      const compAdjustment = this.calculateComparableAdjustment(input.comps, input.parcelSize);
      basePrice *= compAdjustment.multiplier;
      confidence += 0.2;
      reasoning.push(`Comparable sales adjustment: ${(compAdjustment.multiplier - 1) * 100}% (${input.comps.length} comps)`);
    }

    // Soil quality adjustment
    if (input.soilScore !== undefined) {
      const soilMultiplier = this.getSoilMultiplier(input.soilScore);
      basePrice *= soilMultiplier;
      confidence += 0.1;
      reasoning.push(`Soil quality adjustment: ${(soilMultiplier - 1) * 100}% (score: ${input.soilScore})`);
    }

    // Infrastructure adjustment
    if (input.infraScore !== undefined) {
      const infraMultiplier = this.getInfrastructureMultiplier(input.infraScore);
      basePrice *= infraMultiplier;
      confidence += 0.1;
      reasoning.push(`Infrastructure adjustment: ${(infraMultiplier - 1) * 100}% (score: ${input.infraScore})`);
    }

    // Geospatial data adjustment
    if (input.geoJson) {
      const geoMultiplier = this.getGeospatialMultiplier(input.geoJson);
      basePrice *= geoMultiplier;
      confidence += 0.1;
      reasoning.push(`Geospatial adjustment: ${(geoMultiplier - 1) * 100}%`);
    }

    // Final price calculation
    const finalPrice = basePrice * input.parcelSize;
    const finalConfidence = Math.min(confidence, 0.95); // Cap at 95%

    // Update stats
    this.stats.totalPredictions++;
    this.stats.averageConfidence = (this.stats.averageConfidence * (this.stats.totalPredictions - 1) + finalConfidence) / this.stats.totalPredictions;
    this.stats.lastPrediction = new Date();

    return {
      price: Math.round(finalPrice * 100) / 100,
      confidence: Math.round(finalConfidence * 100) / 100,
      reasoning,
    };
  }

  private getStateMultipliers(): Record<string, number> {
    return {
      'california': 2.5,
      'texas': 1.8,
      'florida': 1.6,
      'new york': 2.2,
      'massachusetts': 2.0,
      'washington': 1.9,
      'oregon': 1.7,
      'colorado': 1.5,
      'utah': 1.4,
      'nevada': 1.3,
      'arizona': 1.2,
      'default': 1.0,
    };
  }

  private getStateMultiplier(location: string, multipliers: Record<string, number>): number {
    const locationLower = location.toLowerCase();
    
    for (const [state, multiplier] of Object.entries(multipliers)) {
      if (locationLower.includes(state)) {
        return multiplier;
      }
    }
    
    return multipliers.default;
  }

  private getSizeMultiplier(parcelSize: number): number {
    if (parcelSize >= 1000) {
      return 1.3; // Large parcels get premium
    } else if (parcelSize >= 100) {
      return 1.2;
    } else if (parcelSize >= 50) {
      return 1.1;
    } else if (parcelSize >= 10) {
      return 1.0;
    } else if (parcelSize >= 1) {
      return 0.9; // Small parcels get discount
    } else {
      return 0.8; // Very small parcels get bigger discount
    }
  }

  private calculateComparableAdjustment(comps: Array<{ location: string; size: number; price: number }>, targetSize: number) {
    // Calculate average price per acre from comparables
    const avgPricePerAcre = comps.reduce((sum, comp) => sum + (comp.price / comp.size), 0) / comps.length;
    
    // Calculate our base price per acre
    const basePricePerAcre = 1000; // This should match the base price in predict method
    
    // Calculate multiplier
    const multiplier = avgPricePerAcre / basePricePerAcre;
    
    return {
      multiplier: Math.max(0.5, Math.min(2.0, multiplier)), // Clamp between 0.5x and 2.0x
      avgPricePerAcre,
    };
  }

  private getSoilMultiplier(soilScore: number): number {
    if (soilScore >= 90) {
      return 1.2;
    } else if (soilScore >= 80) {
      return 1.1;
    } else if (soilScore >= 70) {
      return 1.0;
    } else if (soilScore >= 60) {
      return 0.9;
    } else {
      return 0.8;
    }
  }

  private getInfrastructureMultiplier(infraScore: number): number {
    if (infraScore >= 90) {
      return 1.3;
    } else if (infraScore >= 80) {
      return 1.2;
    } else if (infraScore >= 70) {
      return 1.1;
    } else if (infraScore >= 60) {
      return 1.0;
    } else if (infraScore >= 50) {
      return 0.9;
    } else {
      return 0.8;
    }
  }

  private getGeospatialMultiplier(geoJson: any): number {
    // Simple geospatial analysis
    // In a real implementation, this would analyze the actual GeoJSON data
    // For now, return a neutral multiplier
    return 1.0;
  }

  getStats() {
    return { ...this.stats };
  }
}