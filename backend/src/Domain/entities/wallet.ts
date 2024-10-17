export interface Wallet{
    id?:string,
    userId:string,
    balance:number,
    transactions:Transaction[]
}

export interface Transaction{
    orderId?:string,
    action:'debit'|'credit',
    amount:number;
    date:Date;

}