import * as mongoose from 'mongoose';
import { IsDate, IsDateString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';




export class CreateUserDto {

    _id: mongoose.Types.ObjectId

    @ApiProperty({ example: "john" })
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 25 })
    @IsNotEmpty()
    @IsNumber()
    age: number

    @ApiProperty({ example: "1990-01-01" })
    @IsNotEmpty()
    @IsDateString()
    birthday: Date

    @ApiProperty({ example: "Male" })
    @IsNotEmpty()
    gender: string

    @ApiProperty({ example: 180 })
    @IsNotEmpty()
    @IsNumber()
    height: number

    @ApiProperty({ example: 70 })
    @IsNotEmpty()
    @IsNumber()
    weight: number
}
