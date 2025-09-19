import { Connection, PublicKey, Transaction } from '@solana/web3.js';

const SOLANA_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

export const connection = new Connection(SOLANA_RPC, 'confirmed');

export interface WalletContextType {
  wallet: any;
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

export const getPhantomWallet = () => {
  if (typeof window !== 'undefined' && window.solana && window.solana.isPhantom) {
    return window.solana;
  }
  return null;
};

export const connectPhantomWallet = async () => {
  const phantom = getPhantomWallet();
  if (!phantom) {
    throw new Error('Phantom wallet not found. Please install Phantom wallet.');
  }

  try {
    const response = await phantom.connect();
    return response.publicKey;
  } catch (error) {
    throw new Error('Failed to connect to Phantom wallet');
  }
};

export const disconnectPhantomWallet = async () => {
  const phantom = getPhantomWallet();
  if (phantom) {
    await phantom.disconnect();
  }
};

export const signTransaction = async (transaction: Transaction) => {
  const phantom = getPhantomWallet();
  if (!phantom) {
    throw new Error('Phantom wallet not found');
  }

  try {
    const signedTransaction = await phantom.signTransaction(transaction);
    return signedTransaction;
  } catch (error) {
    throw new Error('Failed to sign transaction');
  }
};

export const sendTransaction = async (transaction: Transaction) => {
  try {
    const signature = await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    throw new Error('Failed to send transaction');
  }
};

// Utility function to format wallet address
export const formatWalletAddress = (address: string, length = 4) => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

// Utility function to validate Solana address
export const isValidSolanaAddress = (address: string) => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};