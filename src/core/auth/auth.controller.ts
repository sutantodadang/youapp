import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterUserDTO } from './dto/register.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Login User', example: { token: "87aby87dna87wbtdy8a7wt8dat8wdat88" } })
  @Post("/login")
  async login(@Body() loginUserDTO: LoginUserDTO): Promise<any> {
    return await this.authService.login(loginUserDTO);
  }


  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 200, description: 'Register User', example: { message: "created" } })
  @Post("/register")
  async register(@Body() registerUserDTO: RegisterUserDTO): Promise<any> {

    if (registerUserDTO.password != registerUserDTO.confirm_password) {
      throw new HttpException('password not valid', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return this.authService.register(registerUserDTO)
  }


}
