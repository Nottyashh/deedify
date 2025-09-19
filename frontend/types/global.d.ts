interface Window {
  solana?: {
    isPhantom?: boolean;
    connect(): Promise<{ publicKey: import('@solana/web3.js').PublicKey }>;
    disconnect(): Promise<void>;
    signTransaction(transaction: import('@solana/web3.js').Transaction): Promise<import('@solana/web3.js').Transaction>;
    signAllTransactions(transactions: import('@solana/web3.js').Transaction[]): Promise<import('@solana/web3.js').Transaction[]>;
    on(event: string, callback: Function): void;
    removeAllListeners(): void;
    isConnected: boolean;
    publicKey: import('@solana/web3.js').PublicKey | null;
  };
}