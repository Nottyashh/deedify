'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { holdingsApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Users, DollarSign, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Holding {
  id: string;
  userId: string;
  listingId: string;
  shares: number;
  totalInvested: number;
  currentValue: number;
  listing: {
    id: string;
    title: string;
    locationText: string;
    parcelSize: number;
    pricePerShare: number;
    totalShares: number;
  };
}

export default function HoldingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchHoldings();
  }, [user]);

  const fetchHoldings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await holdingsApi.getUserHoldings(user.id);
      setHoldings(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch holdings');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  const totalInvested = holdings.reduce((sum, holding) => sum + holding.totalInvested, 0);
  const totalCurrentValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return (
    <div className="container py-8">
      <div className="page-header">
        <h1 className="page-title">My Holdings</h1>
        <p className="page-subtitle">
          Track your land investments and portfolio performance
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {holdings.length}
          </div>
          <div className="text-sm text-gray-600">Properties</div>
        </Card>

        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalInvested.toFixed(4)} SOL
          </div>
          <div className="text-sm text-gray-600">Total Invested</div>
        </Card>

        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalCurrentValue.toFixed(4)} SOL
          </div>
          <div className="text-sm text-gray-600">Current Value</div>
        </Card>

        <Card className="text-center">
          <div className={`text-2xl font-bold mb-1 ${
            totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalGainLoss >= 0 ? '+' : ''}{totalGainLoss.toFixed(4)} SOL
          </div>
          <div className={`text-sm ${
            totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
          </div>
        </Card>
      </div>

      {/* Holdings List */}
      {holdings.length === 0 ? (
        <Card className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Holdings Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't purchased any land shares yet. Start building your portfolio today!
            </p>
            <Button onClick={() => router.push('/listings')}>
              Browse Properties
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {holdings.map((holding) => {
            const gainLoss = holding.currentValue - holding.totalInvested;
            const gainLossPercent = holding.totalInvested > 0 ? (gainLoss / holding.totalInvested) * 100 : 0;
            const ownershipPercent = (holding.shares / holding.listing.totalShares) * 100;

            return (
              <Card key={holding.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {holding.listing.title}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {holding.listing.locationText}
                        </div>
                      </div>
                      <div className={`text-right ${
                        gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className="font-semibold">
                          {gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(4)} SOL
                        </div>
                        <div className="text-sm">
                          {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Shares Owned</div>
                        <div className="font-medium">{holding.shares}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Ownership</div>
                        <div className="font-medium">{ownershipPercent.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Invested</div>
                        <div className="font-medium">{holding.totalInvested.toFixed(4)} SOL</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Current Value</div>
                        <div className="font-medium">{holding.currentValue.toFixed(4)} SOL</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/listings/${holding.listing.id}`)}
                    >
                      View Property
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement sell functionality
                        toast.info('Sell functionality coming soon');
                      }}
                    >
                      Sell Shares
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}