import { Wallet,Transaction } from "../../../Domain/entities/wallet";
import mongoose,{Schema,Document} from 'mongoose'


const transactionSchema:Schema=new Schema({
  orderId:{type:String,required:false},
  action:{type:String,enum:['debit','credit'],required:true},
  amount:{type:Number,required:true},
  date:{type:Date,default:Date.now}
})
const walletSchema:Schema=new Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    balance:{type:String,required:true},
    transactions:[transactionSchema]
})

export const walletModel=mongoose.model<Wallet>('wallet',walletSchema)