import mongoose, { Schema } from "mongoose";

interface User extends Document{
    email: string;
    password: string;
    rememberMe: boolean;
    createdAt?: Date;
    _id?: string;
    token?: string;
}

const UserSchema: Schema<User> = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  rememberMe: { type: Boolean, required: false, default: false },
  createdAt: { type: Date, default: Date.now },
  token: { type: String, required: false }
});

const User = mongoose.model<User>('users', UserSchema);

export default User;
