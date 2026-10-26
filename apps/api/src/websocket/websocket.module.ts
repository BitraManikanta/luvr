import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LuvoraGateway } from './luvora.gateway';
import { MessagesModule } from '../messages/messages.module';
import { ConversationsModule } from '../conversations/conversations.module';

@Module({
  imports: [
    MessagesModule,
    ConversationsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        secret: cs.getOrThrow('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LuvoraGateway],
  exports: [LuvoraGateway],
})
export class WebSocketModule {}
