import mongoose, { Document, Schema } from "mongoose";

import { User } from "../../../Domain/entities/user";

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    mobile: { type: String, required: false, trim: true, minlength: 10 },
    password: { type: String,required:false},
    is_verified: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: "wallet" },
  },
  { timestamps: true }
);

// export interface UserModel extends User,Document {}

export const userModel = mongoose.model<User>("User", UserSchema);
