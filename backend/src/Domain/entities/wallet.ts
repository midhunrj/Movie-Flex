export interface WalletTransaction {
    id?: string;
    userId: string;
    orderId?:string;
    type: 'Credit' | 'Debit';
    amount: number;
    date: Date;
    description: string;
  }
  
  export interface Wallet {
    userId: string;
    balance: number;
    transactions: WalletTransaction[];
  }