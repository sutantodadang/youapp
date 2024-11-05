import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class RegisterUserDTO {


    @ApiProperty({ example: "mail@mail.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ example: "john" })
    @IsNotEmpty()
    username: string

    @ApiProperty({ example: "password" })
    @IsNotEmpty()
    password: string

    @ApiProperty({ example: "password" })
    @IsNotEmpty()
    confirm_password: string
}
