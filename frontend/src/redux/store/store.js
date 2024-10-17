import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../user/userSlice'
import adminReducer from '../admin/adminSlice'
import theatreReducer from '../theatre/theatreSlice'
export const store=configureStore({
    reducer:{
    user:userReducer,
    admin:adminReducer,
    theatre:theatreReducer
    }
})