import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum UserRole {
    ADMIN = "admin",
    CANDIDATE = "candidate",
    EXAMINEE = "examinee"
}

@Schema()
export class User {

    @Prop({
        required: true,
    })
    name: string;

    @Prop({
        required: true,
        unique: true,
    })
    username: string;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        default: Date.now(),
    })
    joiningDate: Date;

    @Prop({
        required: true,
        enum: UserRole,
    })
    role: UserRole;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
