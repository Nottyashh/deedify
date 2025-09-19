'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useWallet } from '@/components/WalletProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Wallet, Shield, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { connected, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress || '');

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleUpdateWallet = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        walletAddress: publicKey.toString(),
      });
      setWalletAddress(publicKey.toString());
    } catch (error) {
      // Error handled in AuthProvider
    } finally {
      setLoading(false);
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'EXPIRED':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'LISTER':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'INVESTOR':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">
            Manage your account information and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">Email Address</div>
                  <div className="text-gray-600">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">Account Type</div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium">Member Since</div>
                  <div className="text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* KYC Status */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Verification Status</h2>
            
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">KYC Status</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getKycStatusColor(user.kycStatus)}`}>
                  {user.kycStatus}
                </span>
              </div>
            </div>

            {user.kycStatus === 'PENDING' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  Your KYC verification is pending. You'll receive an email once it's processed.
                </p>
              </div>
            )}

            {user.kycStatus === 'REJECTED' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  Your KYC verification was rejected. Please contact support for assistance.
                </p>
              </div>
            )}
          </Card>

          {/* Wallet Connection */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Wallet Connection</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium">Connected Wallet</div>
                  {user.walletAddress ? (
                    <div className="text-gray-600 font-mono text-sm">
                      {user.walletAddress}
                    </div>
                  ) : (
                    <div className="text-gray-500">No wallet connected</div>
                  )}
                </div>
              </div>

              {connected && publicKey && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-700">Phantom Wallet Connected</div>
                      <div className="text-green-600 font-mono text-sm">
                        {publicKey.toString()}
                      </div>
                    </div>
                    {user.walletAddress !== publicKey.toString() && (
                      <Button
                        onClick={handleUpdateWallet}
                        loading={loading}
                        size="sm"
                      >
                        Update Profile
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {!connected && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    Connect your Phantom wallet to enable trading and receive payouts.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Account Actions */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Account Actions</h2>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => router.push('/holdings')}
                className="w-full justify-start"
              >
                View My Holdings
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/listings')}
                className="w-full justify-start"
              >
                Browse Properties
              </Button>

              {user.role === 'LISTER' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.info('Listing creation coming soon');
                  }}
                  className="w-full justify-start"
                >
                  Create New Listing
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}