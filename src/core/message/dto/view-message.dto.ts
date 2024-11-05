import { IsNotEmpty } from 'class-validator';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';




export class ViewMessageDto {

  @ApiProperty({ example: "879qy3d98q1n2y9d8" })
  @IsNotEmpty()
  sender: mongoose.Types.ObjectId

  @ApiProperty({ example: "rd12tgh65sd16reth5s" })
  @IsNotEmpty()
  receiver: mongoose.Types.ObjectId


}

export class ViewMessageResultDto {

  @ApiProperty({ example: "w34t34g34g34g34gq" })
  _id: mongoose.Types.ObjectId

  @ApiProperty({ example: "12GRQ3R32T222A23SAD" })
  @IsNotEmpty()
  sender: mongoose.Types.ObjectId

  @ApiProperty({ example: "87ywe8r7ya283ry28" })
  @IsNotEmpty()
  receiver: mongoose.Types.ObjectId

  @ApiProperty({ example: "hello world" })
  content: string

  @ApiProperty({ example: "1990-01-01" })
  timestamp: Date

  @ApiProperty({ example: "true" })
  read: boolean


}

