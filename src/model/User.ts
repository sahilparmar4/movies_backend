import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role?: string;
  rememberMe?: boolean;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: false, default: 'user' },
    rememberMe: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model<IUser>('users', UserSchema);

export default User;
