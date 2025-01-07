import Razorpay from 'razorpay'
import crypto from 'crypto'
import { IPaymentRepository } from "../../application/repositories/iPaymentRepository";
import { Payment } from "../../Domain/entities/payment";

export class PaymentRepository implements IPaymentRepository
{ private razorpayInstance:Razorpay


  
    constructor(){
        this.razorpayInstance=new Razorpay({
              key_id: process.env.RAZORPAY_ID_KEY as string,
              key_secret: process.env.Razorsecret_Key as string,
            })
        }
            
           
    async createOrder(currency: string, amount: number, receipt: string): Promise<Payment> {
      try { const order=await this.razorpayInstance.orders.create({
        amount,
        receipt,
        currency
     })
       console.log(order,"fkjdnfkj");
       
     return {
        orderId:order.id,
        amount,
        receipt,
        currency
     }
    }
    catch (error: any) {
      console.error("Error creating Razorpay order:", error);
      throw new Error("Failed to create payment order. Please check your configuration.");
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