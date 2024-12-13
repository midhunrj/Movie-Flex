import { Types } from "mongoose";

export interface Booking {
    _id?: string;
    bookingId?: string; // Added if required
    userId: Types.ObjectId;
    theatreId: Types.ObjectId;
    screenId: Types.ObjectId;
    movieId: Types.ObjectId;
    showtimeId: Types.ObjectId;
    showtime?:string,
    showDate?:Date,
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
