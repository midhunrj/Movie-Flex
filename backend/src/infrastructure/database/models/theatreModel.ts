import mongoose,{Document,Schema} from 'mongoose'

//import { User } from '../../../Domain/entities/user'
import { Theatre } from '../../../Domain/entities/theatre'



const addressSchema = new Schema({
    place: { type: String, required: false },
    city: { type: String, required: false },
    housename: { type: String, required: false },
    primaryPhone: { type: Number, required: true, minlength: 10 },  
    alternateNumber: { type:Number, required: false, minlength: 10 },  
    pincode: { type: Number, required: false },
    district: { type: String, required: false },
    state: { type: String, required: false },
  });

  
  const locationSchema = new Schema({
    type: { type: String, required: true, default: 'Point' },
    coordinates: { type: [Number], required: true },
  });

const theatreSchema=new Schema<Theatre>({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true,trim:true},
    mobile:{type:Number,required:true,trim:true,minlength:10},
    password:{type:String,required:true},
    is_verified:{type:Boolean,default:false},
    is_blocked:{type:Boolean,default:false},
    is_approved: { type: String, enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' }, // using enum
    licenseImage:{type:String,required:true},
    address:addressSchema,
    location:locationSchema
    //wallet:{type:mongoose.Schema.Types.ObjectId,ref:'wallet'},
},{timestamps:true
})




export const theatreModel=mongoose.model<Theatre>('Theatre',theatreSchema)