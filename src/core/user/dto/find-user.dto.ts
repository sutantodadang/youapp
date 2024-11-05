import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';


export class FindUser {
    @ApiProperty({ example: "ObjectId" })
    _id: mongoose.Types.ObjectId

    @ApiProperty({ example: "email@mail.com" })
    email: string

    @ApiProperty({ example: "doe" })
    name: string

    @ApiProperty({ example: 22 })
    age: number

    @ApiProperty({ example: "Male" })
    gender: string

    @ApiProperty({ example: "1990-01-01" })
    birthday: Date

    @ApiProperty({ example: "Rat" })
    horoscope: string

    @ApiProperty({ example: "Virgo" })
    zodiac: string

    @ApiProperty({ example: 177 })
    height: number

    @ApiProperty({ example: 77 })
    weight: number
}

