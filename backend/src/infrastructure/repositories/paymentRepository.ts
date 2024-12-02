import Razorpay from 'razorpay'
import crypto from 'crypto'
import { IPaymentRepository } from "../../application/repositories/iPaymentRepository";
import { Payment } from "../../Domain/entities/payment";

export class PaymentRepository implements IPaymentRepository
{ private razorpayInstance:Razorpay

    constructor(){
        this.razorpayInstance=new Razorpay({
              key_id: process.env.RAZORPAY_ID_KEY!,
              key_secret: process.env.Razorsecret_Key,
            })
        }
            
           
    async createOrder(currency: string, amount: number, receipt: string): Promise<Payment> {
     const order=await this.razorpayInstance.orders.create({
        amount,
        receipt,
        currency
     })

     return {
        orderId:order.id,
        amount,
        receipt,
        currency
     }
        
    }

    verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
        const generatedSignature = crypto
      .createHmac("sha256", process.env.Razorsecret_key!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return generatedSignature === signature;
    }
}