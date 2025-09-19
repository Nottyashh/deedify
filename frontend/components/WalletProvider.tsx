'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { connectPhantomWallet, disconnectPhantomWallet, getPhantomWallet, signTransaction } from '@/lib/wallet';
import toast from 'react-hot-toast';

interface WalletContextType {
  wallet: any;
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    const phantom = getPhantomWallet();
    if (phantom) {
      setWallet(phantom);
      
      // Check if already connected
      if (phantom.isConnected) {
        setConnected(true);
        setPublicKey(phantom.publicKey);
      }

      // Listen for wallet events
      phantom.on('connect', (publicKey: PublicKey) => {
        setConnected(true);
        setPublicKey(publicKey);
        toast.success('Wallet connected successfully');
      });

      phantom.on('disconnect', () => {
        setConnected(false);
        setPublicKey(null);
        toast.success('Wallet disconnected');
      });
    }

    return () => {
      if (phantom) {
        phantom.removeAllListeners();
      }
    };
  }, []);

  const connect = async () => {
    if (connecting) return;
    
    setConnecting(true);
    try {
      const publicKey = await connectPhantomWallet();
      setConnected(true);
      setPublicKey(publicKey);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectPhantomWallet();
      setConnected(false);
      setPublicKey(null);
    } catch (error) {
      toast.error('Failed to disconnect wallet');
    }
  };

  const handleSignTransaction = async (transaction: Transaction) => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }
    return await signTransaction(transaction);
  };

  const value: WalletContextType = {
    wallet,
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
    signTransaction: handleSignTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};