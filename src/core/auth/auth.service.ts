import { Inject, Injectable } from '@nestjs/common';
import { LoginUserDTO } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AnyObject, ClientSession, Document, DocumentSetOptions, Error, FlattenMaps, MergeType, Model, ModifiedPathsSnapshot, pathsToSkip, PopulateOptions, Query, QueryOptions, SaveOptions, ToObjectOptions, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';
import { User } from '../user/entities/user.entity';
import * as bcrypt from "bcrypt";

import { JwtService } from '@nestjs/jwt'
import { RegisterUserDTO } from './dto/register.dto';




@Injectable()
export class AuthService {
  constructor(
    @Inject("USER_MODEL")
    private userModel: Model<User>,
    private jwtService: JwtService


  ) {

  }
  async login(loginUserDTO: LoginUserDTO): Promise<any> {


    const user = await this.userModel.findOne({ email: loginUserDTO.email }).exec()


    if (user.email == "") {
      return "not found"
    }

    const isSame = bcrypt.compare(loginUserDTO.password.toString(), user.password.toString())
    if (!isSame) {
      return "email / password incorrect"
    }

    const { id, name, username } = user

    const jwt = await this.jwtService.signAsync({ id, name, username }, { secret: process.env.JWT_SECRET })


    return {
      token: jwt
    }
  }

  async register(registerUserDTO: RegisterUserDTO): Promise<any> {

    const { email, username, password } = registerUserDTO


    const hash = await bcrypt.hash(password.toString(), 10)

    const newUser = {
      email,
      username,
      password: hash,
      name: null,
      age: null,
      address: null,
      horoscope: null,
      zodiac: null,
      height: null,
      weight: null,

    }

    const result = (await this.userModel.create(newUser)).save()

    return {
      message: "ok",
      data: result
    }
  }


}
