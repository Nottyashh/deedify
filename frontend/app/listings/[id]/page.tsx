'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { listingsApi, ordersApi } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { useWallet } from '@/components/WalletProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPin, Users, DollarSign, Calendar, User, ShoppingCart } from 'lucide-react';
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

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { connected, publicKey } = useWallet();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [fractions, setFractions] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string);
    }
  }, [params.id]);

  const fetchListing = async (id: string) => {
    try {
      setLoading(true);
      const response = await listingsApi.getById(id);
      setListing(response.data);
    } catch (error) {
      toast.error('Failed to fetch listing details');
      router.push('/listings');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase shares');
      router.push('/auth/login');
      return;
    }

    if (!connected || !publicKey) {
      toast.error('Please connect your wallet to purchase shares');
      return;
    }

    if (!listing) return;

    setPurchasing(true);
    try {
      // Step 1: Create order
      const orderResponse = await ordersApi.create({
        listingId: listing.id,
        fractions,
      });

      const orderId = orderResponse.data.id;

      // Step 2: Get payment transaction
      const paymentResponse = await ordersApi.pay(orderId);
      const { transactionData, deepLink } = paymentResponse.data;

      // Step 3: Handle Phantom wallet transaction
      if (transactionData) {
        // TODO: Implement actual transaction signing with Phantom
        // For now, simulate success
        toast.success(`Successfully purchased ${fractions} share(s)!`);
        router.push('/holdings');
      } else if (deepLink) {
        // Open Phantom deep link
        window.open(deepLink, '_blank');
        toast.success('Transaction initiated. Please complete in Phantom wallet.');
      }

    } catch (error: any) {
      const message = error.response?.data?.message || 'Purchase failed';
      toast.error(message);
    } finally {
      setPurchasing(false);
    }
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

  if (!listing) {
    return (
      <div className="container py-8">
        <Card className="text-center py-12">
          <p className="text-gray-500 text-lg">Listing not found.</p>
        </Card>
      </div>
    );
  }

  const totalValue = listing.pricePerShare * listing.totalShares;
  const availableShares = listing.totalShares - listing._count.shareTokens;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2" />
          {listing.locationText}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Property Description</h2>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </Card>

          {/* Property Details */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-gray-600">{listing.locationText}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Parcel Size</div>
                    <div className="text-gray-600">{listing.parcelSize} acres</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Total Shares</div>
                    <div className="text-gray-600">{listing.totalShares}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium">Listed</div>
                    <div className="text-gray-600">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Coordinate Policy */}
          {listing.coordinatePolicy && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Ownership Policy</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center text-blue-700 mb-2">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">Fractional Ownership</span>
                </div>
                <p className="text-blue-700">
                  {listing.coordinatePolicyNote}
                </p>
              </div>
            </Card>
          )}

          {/* Owner Info */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Listed By</h2>
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="font-medium">{listing.owner.email}</div>
                <div className="text-gray-600 text-sm">Property Owner</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Purchase Shares</h2>
            
            <div className="space-y-4">
              {/* Price Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {listing.pricePerShare} SOL
                  </div>
                  <div className="text-sm text-gray-600">per share</div>
                </div>
              </div>

              {/* Shares Input */}
              <div>
                <Input
                  label="Number of Shares"
                  type="number"
                  min="1"
                  max={availableShares}
                  value={fractions}
                  onChange={(e) => setFractions(parseInt(e.target.value) || 1)}
                  helperText={`${availableShares} shares available`}
                />
              </div>

              {/* Total Cost */}
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-lg font-bold text-primary-600">
                    {(listing.pricePerShare * fractions).toFixed(4)} SOL
                  </span>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                loading={purchasing}
                disabled={!user || !connected || availableShares === 0}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {!user ? 'Login to Purchase' : 
                 !connected ? 'Connect Wallet' :
                 availableShares === 0 ? 'Sold Out' :
                 'Purchase Shares'}
              </Button>

              {!user && (
                <p className="text-sm text-gray-600 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/auth/login')}
                    className="p-0 h-auto font-normal"
                  >
                    Login
                  </Button>
                  {' or '}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/auth/register')}
                    className="p-0 h-auto font-normal"
                  >
                    Register
                  </Button>
                  {' to purchase shares'}
                </p>
              )}
            </div>
          </Card>

          {/* Stats Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Property Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium">{totalValue.toFixed(2)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shares Sold:</span>
                <span className="font-medium">{listing._count.shareTokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium">{availableShares}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Orders:</span>
                <span className="font-medium">{listing._count.orders}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}