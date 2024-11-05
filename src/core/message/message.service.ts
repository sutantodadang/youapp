import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { ViewMessageDto } from './dto/view-message.dto';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(
    @Inject("MESSAGE_MODEL")
    private messageModel: Model<Message>,

  ) {

  }
  async create(createMessageDto: CreateMessageDto): Promise<Message> {

    return await (await this.messageModel.create(createMessageDto)).save()
  }

  async findAll(q: ViewMessageDto): Promise<Message[]> {

    return await this.messageModel.find({ sender: q.sender, receiver: q.receiver }).exec()
  }


}
