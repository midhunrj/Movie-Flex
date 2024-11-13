export interface Admin {
    adminLog: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken: string;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface MovieData {
    movieId: string;
    isBlocked: boolean;
  }
  
  export interface ApiResponse<T> {
    data: T;
    message: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
  }
  
  export interface Theatre {
    id: string;
    name: string;
    location: string;
    isApproved: boolean;
  }
  