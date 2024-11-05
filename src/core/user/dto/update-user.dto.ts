import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
