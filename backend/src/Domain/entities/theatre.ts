export interface Theatre{
    _id?:string,
    name:string,
    email:string,
    password:string,
    mobile:number,
    //     primary:number;
    //     alternate?:string;
    // }
    address?:Address;
    location?:Location;
    is_verified:boolean;
    is_blocked:boolean;
    is_approved:string;
    
    licenseImage?: string;

}

interface Location{
    type:string;
    coordinates:number[]
}

interface Address{
    place?:string;
    city?:string;
    housename?:string;
    primaryPhone:number;
    alternatenumber?:number;
    pincode?:number;
    district?:string;
    state?:string;
}