import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUser } from './dto/find-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Create Profile' })
  @ApiResponse({ status: 201, description: 'created' })
  @UseGuards(JwtAuthGuard)
  @Post("createProfile")
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {

    createUserDto._id = req.user.userId
    return await this.userService.create(createUserDto);
  }


  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'get profile', type: FindUser })
  @UseGuards(JwtAuthGuard)
  @Get("getProfile")
  async findOne(@Request() req) {

    return await this.userService.findOne(req.user.userId);
  }


  @ApiOperation({ summary: 'Update Profile' })
  @ApiResponse({ status: 200, description: 'updated' })
  @UseGuards(JwtAuthGuard)
  @Patch("updateProfile")
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {

    return this.userService.update(req.user.userId, updateUserDto);
  }


  @ApiOperation({ summary: 'Upsert Profile Interest' })
  @ApiResponse({ status: 200, description: 'Upsert Profile Interest' })
  @UseGuards(JwtAuthGuard)
  @Post("upsertInterest")
  upsertInterest(@Request() req, @Body() createUserInterestDto: CreateUserInterestDto) {

    createUserInterestDto._id = req.user.userId

    return this.userService.upsertInterest(createUserInterestDto);
  }



}
