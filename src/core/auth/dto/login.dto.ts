import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class LoginUserDTO {

    @ApiProperty({ example: "mail@mail.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ example: "password" })
    @IsNotEmpty()
    password: string
}

