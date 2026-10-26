import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { KeysModule } from './keys/keys.module';
import { MediaModule } from './media/media.module';
import { WebSocketModule } from './websocket/websocket.module';
import { HealthModule } from './health/health.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 100 },
    ]),

    // Feature modules
    AuthModule,
    UsersModule,
    ConversationsModule,
    MessagesModule,
    KeysModule,
    MediaModule,
    WebSocketModule,
    HealthModule,
  ],
})
export class AppModule {}
