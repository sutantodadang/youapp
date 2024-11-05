import * as mongoose from 'mongoose';
import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';




export class CreateUserInterestDto {

    _id: mongoose.Types.ObjectId

    @ApiProperty({ example: "john" })
    @IsNotEmpty()
    @IsArray()
    interest: string[]

    @ApiProperty({ example: "87sdt8aw8dqa8wd87" })
    @IsNotEmpty()
    userId: mongoose.Types.ObjectId



}
