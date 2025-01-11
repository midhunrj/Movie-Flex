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
        return await walletModel.findOne({ userId }).sort({date:-1});
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

      async getWalletByUser(userId: string, page: number, limit: number): Promise<Wallet | null> {
         const skip=(page-1)*limit
        // const wallet = await walletModel.findOne({ userId});
        // if (!wallet) {
        //     const isValid=await userModel.findById(userId)
        //     if(isValid)
        //     {
        //     const newWallet = new walletModel({ userId:userId });
        //     await newWallet.save();
        //     }
        // }

        //const walletData = await wlletModel.findOne({ userId: user.user.id });
        const wallet = await walletModel.aggregate([
          { $match: { userId } }, // Match the wallet by userId
          {
              $project: {
                  _id: 1,
                  userId: 1,
                  balance: 1,
                  transactions: {
                      $slice: ['$transactions', skip, limit], // Paginate transactions array
                  },
              },
          },
      ]);
  
      return wallet.length > 0 ? wallet[0] : null; 
      }
}