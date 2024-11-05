import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MessageModule } from './core/message/message.module';
import { UserModule } from './core/user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/log.middleware';

@Module({
  imports: [UserModule, MessageModule, DatabaseModule, AuthModule, ConfigModule.forRoot({ cache: true, isGlobal: true })],

})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware).forRoutes("*")
  }
}
