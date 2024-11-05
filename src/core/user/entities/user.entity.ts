// export class User {}
import { ApiProperty } from '@nestjs/swagger';

import * as mongoose from 'mongoose';



enum GENDER {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    email: String,
    password: String,
    username: String,
    name: String,
    age: Number,
    gender: String,
    birthday: Date,
    horoscope: String,
    zodiac: String,
    height: Number,
    weight: Number
});




export interface User extends mongoose.Document {
    readonly _id: mongoose.Types.ObjectId,
    readonly email: string,
    readonly password: string,
    readonly username: string,
    readonly name: string,
    readonly age: number,
    readonly gender: string,
    readonly birthday: Date,
    readonly horoscope: string,
    readonly zodiac: string,
    readonly height: number,
    readonly weight: number
}

export interface IUser {
    readonly _id: mongoose.Types.ObjectId,
    readonly email: string,
    readonly password: string,
    readonly username: string,
    readonly name: string,
    readonly age: number,
    readonly gender: string,
    readonly birthday: Date,
    readonly horoscope: string,
    readonly zodiac: string,
    readonly height: number,
    readonly weight: number
    readonly interest: string[] | null
}

export type UserFind = Omit<IUser, "email" | "password">

export const InterestSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, auto: true },
    interest: [String],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});


export interface Interest extends mongoose.Document {
    readonly _id: mongoose.Types.ObjectId,
    readonly interest: [string],
    readonly userId: mongoose.Types.ObjectId,

}