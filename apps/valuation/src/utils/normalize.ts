/**
 * Utility functions for normalizing input data for the valuation models
 */

export function normalizeLocation(location: string): string {
  if (!location || typeof location !== 'string') {
    return 'unknown';
  }

  // Convert to lowercase and trim
  let normalized = location.toLowerCase().trim();

  // Remove common prefixes/suffixes
  normalized = normalized.replace(/^(in|near|close to|around)\s+/i, '');
  normalized = normalized.replace(/\s+(county|state|province)$/i, '');

  // Handle common abbreviations
  const abbreviations: Record<string, string> = {
    'ca': 'california',
    'tx': 'texas',
    'fl': 'florida',
    'ny': 'new york',
    'ma': 'massachusetts',
    'wa': 'washington',
    'or': 'oregon',
    'co': 'colorado',
    'ut': 'utah',
    'nv': 'nevada',
    'az': 'arizona',
  };

  // Replace abbreviations
  for (const [abbr, full] of Object.entries(abbreviations)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    normalized = normalized.replace(regex, full);
  }

  // Handle common variations
  const variations: Record<string, string> = {
    'calif': 'california',
    'cali': 'california',
    'mass': 'massachusetts',
    'wash': 'washington',
    'colo': 'colorado',
  };

  for (const [variation, standard] of Object.entries(variations)) {
    const regex = new RegExp(`\\b${variation}\\b`, 'gi');
    normalized = normalized.replace(regex, standard);
  }

  return normalized;
}

export function normalizeParcelSize(parcelSize: number): number {
  if (typeof parcelSize !== 'number' || isNaN(parcelSize) || parcelSize <= 0) {
    return 1; // Default to 1 acre
  }

  // Round to 2 decimal places
  return Math.round(parcelSize * 100) / 100;
}

export function normalizePrice(price: number): number {
  if (typeof price !== 'number' || isNaN(price) || price < 0) {
    return 0;
  }

  // Round to 2 decimal places
  return Math.round(price * 100) / 100;
}

export function normalizeScore(score: number, min: number = 0, max: number = 100): number {
  if (typeof score !== 'number' || isNaN(score)) {
    return (min + max) / 2; // Return middle value
  }

  // Clamp to min/max range
  const clamped = Math.max(min, Math.min(max, score));
  
  // Round to 1 decimal place
  return Math.round(clamped * 10) / 10;
}

export function normalizeGeoJson(geoJson: any): any {
  if (!geoJson || typeof geoJson !== 'object') {
    return null;
  }

  // Basic validation for GeoJSON structure
  if (geoJson.type && geoJson.coordinates) {
    return geoJson;
  }

  return null;
}

export function normalizeComparableSales(comps: Array<{
  location: string;
  size: number;
  price: number;
}>): Array<{
  location: string;
  size: number;
  price: number;
}> {
  if (!Array.isArray(comps)) {
    return [];
  }

  return comps
    .filter(comp => 
      comp && 
      typeof comp.location === 'string' && 
      typeof comp.size === 'number' && 
      typeof comp.price === 'number' &&
      comp.size > 0 &&
      comp.price > 0
    )
    .map(comp => ({
      location: normalizeLocation(comp.location),
      size: normalizeParcelSize(comp.size),
      price: normalizePrice(comp.price),
    }));
}