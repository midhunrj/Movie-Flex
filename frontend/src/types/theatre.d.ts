// src/types/theatre.d.ts

export interface RegisterPayload {
    name: string;
    email: string;
    mobile: string;
    password: string;
    file?: File;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface AddMoviesPayload {
    movie: string;
    screenId: string;
  }
  
  export interface CompleteProfilePayload {
    addressData: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }
  
  export interface ScreenData {
    name: string;
    capacity: number;
    theatreId: string;
  }
  
  export interface TierDataPayload {
    tierData: any;
    screenId: string;
  }
  
  export interface ShowtimePayload {
    showData: {
      movieId: string;
      screenId: string;
      showTime: Date;
      tierPricing: Record<string, number>;
    };
  }
  
  export interface ForgotPasswordPayload {
    email: string;
  }
  
  export interface ResetPasswordPayload {
    newPassword: string;
  }
  