import { Payment } from "../../Domain/entities/payment"

export interface IPaymentRepository{
    createOrder(currency:string,amount:number,receipt:string):Promise<Payment>
    verifyPayment(orderId:string,payemntId:string,signature:string):boolean
}