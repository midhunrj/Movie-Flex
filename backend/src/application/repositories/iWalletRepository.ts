import { Wallet, WalletTransaction } from "../../Domain/entities/wallet";


export interface IWalletRepository {
  getWalletByUserId(userId: string): Promise<Wallet | null>;
  updateWallet(userId: string, amount: number, transaction: WalletTransaction): Promise<void>;
}