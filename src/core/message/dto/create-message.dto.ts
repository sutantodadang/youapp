import { IsNotEmpty, IsString } from 'class-validator';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';



export class CreateMessageDto {

    @ApiProperty({ example: "872eby8729ye8927nye9" })
    @IsNotEmpty()
    sender: mongoose.Types.ObjectId

    @ApiProperty({ example: "0q9wud908quwn0duq90" })
    @IsNotEmpty()
    receiver: mongoose.Types.ObjectId

    @ApiProperty({ example: "hello world" })
    @IsNotEmpty()
    @IsString()
    content: string

}
