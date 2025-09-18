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

export class LinearRegressionModel {
  private stats = {
    totalPredictions: 0,
    averageConfidence: 0,
    lastPrediction: null as Date | null,
  };

  // Stored coefficients (in a real implementation, these would be loaded from a trained model)
  private coefficients = {
    intercept: 1000,
    location: 0.5,
    parcelSize: 0.8,
    soilScore: 0.1,
    infraScore: 0.15,
    comps: 0.3,
  };

  async predict(input: ValuationInput): Promise<ValuationOutput> {
    const reasoning: string[] = [];
    
    // Normalize inputs
    const normalizedLocation = normalizeLocation(input.location);
    const normalizedParcelSize = normalizeParcelSize(input.parcelSize);
    
    // Calculate features
    const features = this.calculateFeatures(input, normalizedLocation, normalizedParcelSize);
    
    // Apply linear regression formula
    let prediction = this.coefficients.intercept;
    prediction += this.coefficients.location * features.locationScore;
    prediction += this.coefficients.parcelSize * features.parcelSizeScore;
    prediction += this.coefficients.soilScore * features.soilScore;
    prediction += this.coefficients.infraScore * features.infraScore;
    prediction += this.coefficients.comps * features.compsScore;
    
    // Apply to total parcel size
    const totalPrice = prediction * input.parcelSize;
    
    // Calculate confidence based on available features
    let confidence = 0.4; // Base confidence
    if (features.locationScore > 0) confidence += 0.2;
    if (features.parcelSizeScore > 0) confidence += 0.1;
    if (features.soilScore > 0) confidence += 0.1;
    if (features.infraScore > 0) confidence += 0.1;
    if (features.compsScore > 0) confidence += 0.2;
    
    confidence = Math.min(confidence, 0.9); // Cap at 90%
    
    // Build reasoning
    reasoning.push(`Linear regression prediction: $${Math.round(prediction)} per acre`);
    if (features.locationScore > 0) {
      reasoning.push(`Location feature: ${features.locationScore.toFixed(2)}`);
    }
    if (features.parcelSizeScore > 0) {
      reasoning.push(`Parcel size feature: ${features.parcelSizeScore.toFixed(2)}`);
    }
    if (features.soilScore > 0) {
      reasoning.push(`Soil quality feature: ${features.soilScore.toFixed(2)}`);
    }
    if (features.infraScore > 0) {
      reasoning.push(`Infrastructure feature: ${features.infraScore.toFixed(2)}`);
    }
    if (features.compsScore > 0) {
      reasoning.push(`Comparable sales feature: ${features.compsScore.toFixed(2)}`);
    }
    
    // Update stats
    this.stats.totalPredictions++;
    this.stats.averageConfidence = (this.stats.averageConfidence * (this.stats.totalPredictions - 1) + confidence) / this.stats.totalPredictions;
    this.stats.lastPrediction = new Date();
    
    return {
      price: Math.round(totalPrice * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      reasoning,
    };
  }

  private calculateFeatures(input: ValuationInput, normalizedLocation: string, normalizedParcelSize: number) {
    const features = {
      locationScore: 0,
      parcelSizeScore: 0,
      soilScore: 0,
      infraScore: 0,
      compsScore: 0,
    };
    
    // Location score (based on state/region)
    features.locationScore = this.getLocationScore(normalizedLocation);
    
    // Parcel size score (logarithmic scaling)
    features.parcelSizeScore = Math.log10(Math.max(1, normalizedParcelSize));
    
    // Soil score (normalized 0-1)
    if (input.soilScore !== undefined) {
      features.soilScore = input.soilScore / 100;
    }
    
    // Infrastructure score (normalized 0-1)
    if (input.infraScore !== undefined) {
      features.infraScore = input.infraScore / 100;
    }
    
    // Comparable sales score
    if (input.comps && input.comps.length > 0) {
      features.compsScore = this.calculateCompsScore(input.comps, input.parcelSize);
    }
    
    return features;
  }

  private getLocationScore(location: string): number {
    // Location scoring based on state/region
    const locationScores: Record<string, number> = {
      'california': 2.0,
      'texas': 1.5,
      'florida': 1.3,
      'new york': 1.8,
      'massachusetts': 1.6,
      'washington': 1.4,
      'oregon': 1.2,
      'colorado': 1.1,
      'utah': 1.0,
      'nevada': 0.9,
      'arizona': 0.8,
      'default': 1.0,
    };
    
    const locationLower = location.toLowerCase();
    
    for (const [state, score] of Object.entries(locationScores)) {
      if (locationLower.includes(state)) {
        return score;
      }
    }
    
    return locationScores.default;
  }

  private calculateCompsScore(comps: Array<{ location: string; size: number; price: number }>, targetSize: number): number {
    // Calculate average price per acre from comparables
    const avgPricePerAcre = comps.reduce((sum, comp) => sum + (comp.price / comp.size), 0) / comps.length;
    
    // Normalize to 0-1 range (assuming $0-$5000 per acre range)
    const normalizedPrice = Math.min(avgPricePerAcre / 5000, 1);
    
    // Apply size similarity bonus
    const sizeSimilarity = this.calculateSizeSimilarity(comps, targetSize);
    
    return normalizedPrice * sizeSimilarity;
  }

  private calculateSizeSimilarity(comps: Array<{ size: number }>, targetSize: number): number {
    // Calculate how similar the comparable sizes are to target size
    const similarities = comps.map(comp => {
      const ratio = Math.min(comp.size, targetSize) / Math.max(comp.size, targetSize);
      return ratio;
    });
    
    return similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;
  }

  // Method to update coefficients (for model training)
  updateCoefficients(newCoefficients: Partial<typeof this.coefficients>) {
    this.coefficients = { ...this.coefficients, ...newCoefficients };
  }

  // Method to get current coefficients
  getCoefficients() {
    return { ...this.coefficients };
  }

  getStats() {
    return { ...this.stats };
  }
}