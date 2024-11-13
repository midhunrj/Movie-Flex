export interface User{
    _id?:string;
    name:string;
    email:string;
    mobile:string; 
    password:string;
    is_verified:boolean;
    is_blocked:boolean;
    wallet?:string;
    

}