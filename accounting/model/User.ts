import {Document, Schema, model} from 'mongoose';
import {roles} from "./Role";

export interface IUser extends Document {
    login:string;
    password:string;
    firstName:string;
    lastName:string;
    roles:string[];
}

const userSchema = new Schema<IUser>(
    {
        login: { type: String, required: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        roles: {
            type: [String],
            required: true,
            default: ['user'],
            enum: roles,
            set: (roles: string[]) => Array.from(new Set(roles))
        }
    },
    { versionKey: false }
);

export const User = model<IUser>('User', userSchema);