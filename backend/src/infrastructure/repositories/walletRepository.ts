import { IWalletRepository } from "../../application/repositories/iWalletRepository";
import { Wallet, WalletTransaction } from "../../Domain/entities/wallet";
import { userModel } from "../database/models/userModel";
import walletModel from "../database/models/walletModel";

export class WalletRepository implements IWalletRepository
{
    async getWalletByUserId(userId: string): Promise<Wallet | null> {
        const wallet = await walletModel.findOne({ userId});
        if (!wallet) {
            const isValid=await userModel.findById(userId)
            if(isValid)
            {
            const newWallet = new walletModel({ userId:userId });
            await newWallet.save();
            }
        }

        //const walletData = await wlletModel.findOne({ userId: user.user.id });
        return await walletModel.findOne({ userId });
      }
    
      async updateWallet(userId: string, amount: number, transaction: WalletTransaction): Promise<void> {
        const wallet = await walletModel.findOne({ userId });
    
        if (!wallet) {
          await walletModel.create({
            userId,
            balance: amount,
            transactions: [transaction],
          });
        } else {
          wallet.balance += amount;
          wallet.transactions.push(transaction);
          await wallet.save();
        }
        console.log(wallet,"wallet");
      }

      
}