// src/infrastructure/models/walletModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Wallet, WalletTransaction } from '../../../Domain/entities/wallet';


interface WalletDocument extends Wallet, Document {}

const WalletTransactionSchema = new Schema<WalletTransaction>({
  userId: { type: String, required: true },
  type: { type: String, enum: ['Credit', 'Debit'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
});

const WalletSchema = new Schema<WalletDocument>({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [WalletTransactionSchema],
});

export default mongoose.model<WalletDocument>('Wallet', WalletSchema);
