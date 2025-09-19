'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { listingsApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPin, Users, DollarSign, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Listing {
  id: string;
  title: string;
  description: string;
  locationText: string;
  parcelSize: number;
  coordinatePolicy: boolean;
  coordinatePolicyNote: string;
  totalShares: number;
  pricePerShare: number;
  status: string;
  createdAt: string;
  owner: {
    email: string;
  };
  _count: {
    shareTokens: number;
    orders: number;
  };
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsApi.getPublic({
        search: searchTerm,
        location: filters.location,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        minSize: filters.minSize ? parseFloat(filters.minSize) : undefined,
        maxSize: filters.maxSize ? parseFloat(filters.maxSize) : undefined,
      });
      setListings(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="page-header">
        <h1 className="page-title">Land Listings</h1>
        <p className="page-subtitle">
          Discover fractional ownership opportunities in prime land parcels
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="md:w-auto">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
            />
            <Input
              name="minPrice"
              placeholder="Min Price (SOL)"
              type="number"
              step="0.01"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
            <Input
              name="maxPrice"
              placeholder="Max Price (SOL)"
              type="number"
              step="0.01"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
            <Input
              name="minSize"
              placeholder="Min Size (acres)"
              type="number"
              value={filters.minSize}
              onChange={handleFilterChange}
            />
            <Input
              name="maxSize"
              placeholder="Max Size (acres)"
              type="number"
              value={filters.maxSize}
              onChange={handleFilterChange}
            />
          </div>
        </form>
      </Card>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
        </Card>
      ) : (
        <div className="grid-listings">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.locationText}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-3">
                  {listing.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {listing.parcelSize} acres
                    </div>
                    <div className="text-xs text-gray-500">Parcel Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary-600">
                      {listing.pricePerShare} SOL
                    </div>
                    <div className="text-xs text-gray-500">Per Share</div>
                  </div>
                </div>

                {/* Coordinate Policy Badge */}
                {listing.coordinatePolicy && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center text-blue-700 text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="font-medium">Fractional Ownership</span>
                    </div>
                    <p className="text-blue-600 text-xs mt-1">
                      {listing.coordinatePolicyNote}
                    </p>
                  </div>
                )}

                {/* Shares Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{listing.totalShares} total shares</span>
                  <span>{listing._count.shareTokens} minted</span>
                </div>

                {/* Action Button */}
                <Link href={`/listings/${listing.id}`}>
                  <Button className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}