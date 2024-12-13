import { MovieType } from "./movieTypes";
import { User } from "./userTypes";


export interface BookingType {
    _id?: string;
    bookingId?: string; // Added if required
    userId: User;
    theatreId: string;
    screenId: string;
    movieId: MovieType;
    showtimeId: {_id:string,showtime:string,date:string};
    showtime?:string
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
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    cancellationPolicy: {
        refundable: boolean;
        refundAmount: number;
        cancellationTime: Date;
    };
    createdAt: Date;
    expiresAt: Date;
    refundRequested?: boolean;
}
