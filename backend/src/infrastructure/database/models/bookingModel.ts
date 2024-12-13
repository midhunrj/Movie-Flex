import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
    _id: string;
    bookingId: string; 
    userId: Types.ObjectId;
    theatreId: Types.ObjectId;
    screenId: Types.ObjectId;
    movieId: Types.ObjectId;
    showtimeId: Types.ObjectId;
    showtime:string,
    showDate:Date,
    selectedSeats: string[];
    totalPrice?: number;
    theatreDetails?: {
        name: string;
        address?: {
            place?: string;
            city?: string;
            housename?: string;
            primaryPhone: number;
            alternateNumber?: number;
            pincode?: number;
            district?: string;
            state?: string;
        };
    };
    screenData?: {
        screenName: string;
        screenType: string;
        ticketRate: number;
        tierName: string;
    };
    status: 'Reserved' | 'Booked' | 'Cancelled' | 'Expired';
    paymentStatus: 'Pending' | 'Paid' | 'Failed'|'Cancelled'|'Refund';
    cancellationPolicy: {
        refundable: boolean;
        refundAmount: number;
        cancellationTime: Date;
    };
    createdAt: Date;
    expiresAt: Date;
    refundRequested?: boolean;
}

const BookingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  theatreId: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true },
  screenId: { type: Schema.Types.ObjectId, ref: 'Screen', required: true },
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  showtimeId: { type: Schema.Types.ObjectId, ref: 'Showtime', required: true },
  showtime:{type:String,required:true},
  showDate:{type:Date,required:true},
  bookingId:{type: String, required: true, unique: true},
  selectedSeats: {type:[String],required:true},
  totalPrice: { type: Number },
  theatreDetails: {
    name: { type: String, required: true },
    address: {
        place: { type: String, required: false },
        city: { type: String, required: false },
        housename: { type: String, required: false },
        primaryPhone: { type: Number, required: true, minlength: 10 },  
        alternateNumber: { type:Number, required: false, minlength: 10 },  
        pincode: { type: Number, required: false },
        district: { type: String, required: false },
        state: { type: String, required: false },
    },
  },
  screenData: {
    screenName: { type: String, required: true },
    screenType: { type: String, required: true },
    ticketRate: { type: Number, required: true },
    tierName:{type:String,required:true}
  },
  status: { type: String, enum: ['Reserved', 'Booked', 'Cancelled', 'Expired'], default: 'Reserved' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed','Cancelled','Refund'], default: 'Pending' },
  cancellationPolicy: {
    refundable: { type: Boolean, default: false },
    refundAmount: { type: Number, default: 0 },
    cancellationTime: { type: Date },
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  refundRequested: { type: Boolean, default: false },
});

export const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);
