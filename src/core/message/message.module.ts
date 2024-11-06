import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { messageProviders } from './message.provider';
import { DatabaseModule } from '../../database/database.module';
import { MessageController } from './message.controller';

@Module({
  controllers: [MessageController],
  imports: [DatabaseModule],
  providers: [MessageGateway, MessageService, ...messageProviders],
})
export class MessageModule { }
