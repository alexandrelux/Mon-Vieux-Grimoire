import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { IUser } from "../types/user";

const userSchema: Schema = new Schema({
    email: { type: String, required: true, uniquel: true },
    password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model<IUser>("User", userSchema);

export default User;
