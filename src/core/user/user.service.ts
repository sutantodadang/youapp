import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import mongoose, { Model, } from 'mongoose';
import { Interest, User, UserFind } from "./entities/user.entity";
import * as dayjs from 'dayjs'
import { getChineseZodiac, getZodiacSign } from 'src/common/utils';
import { CreateUserInterestDto } from './dto/create-user-interest.dto';


@Injectable()
export class UserService {
  constructor(
    @Inject("USER_MODEL")
    private userModel: Model<User>,
    @Inject("INTEREST_MODEL")
    private interestModel: Model<Interest>,

  ) {

  }
  async create(createUserDto: CreateUserDto): Promise<any> {

    const birthday = dayjs(createUserDto.birthday)

    const user = {
      ...createUserDto,
      horoscope: getChineseZodiac(birthday.year()),
      zodiac: getZodiacSign(birthday.date(), birthday.month() + 1),
    }

    const newUser = await this.userModel.findOneAndUpdate({ _id: createUserDto._id }, user, { new: true, upsert: true }).exec()

    if (!newUser) {
      throw new UnprocessableEntityException
    }


    return {
      message: "created"
    }
  }


  async findOne(id: mongoose.Types.ObjectId): Promise<UserFind> {

    const user = await this.userModel.findById(id).exec()
    const interest = await this.interestModel.findById(id).exec() ?? null

    const newUser: UserFind = {
      _id: user._id,
      username: user.username,
      name: user.name,
      age: user.age,
      gender: user.gender,
      birthday: user.birthday,
      horoscope: user.horoscope,
      zodiac: user.zodiac,
      height: user.height,
      weight: user.weight,
      interest: interest ? interest.interest : null,
    }

    return newUser
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {

    const birthday = dayjs(updateUserDto.birthday)

    const user = {
      ...updateUserDto,
      horoscope: getChineseZodiac(birthday.year()),
      zodiac: getZodiacSign(birthday.date(), birthday.month() + 1),
    }


    const updateUser = await this.userModel.updateOne({ _id: id }, user).exec()

    if (updateUser.modifiedCount == 0) {
      throw new UnprocessableEntityException
    }


    return {
      message: "updated"
    }
  }


  async upsertInterest(createUserInterestDto: CreateUserInterestDto): Promise<any> {

    const newUser = await this.interestModel.findOneAndUpdate({ _id: createUserInterestDto._id }, createUserInterestDto, { new: true, upsert: true }).exec()

    if (!newUser) {
      throw new UnprocessableEntityException
    }



    return {
      message: "created"
    }
  }

}
