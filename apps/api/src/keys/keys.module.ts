import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './device.entity';
import { SignedPrekeyEntity, OneTimePrekeyEntity } from './prekey.entity';
import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, SignedPrekeyEntity, OneTimePrekeyEntity])],
  providers: [KeysService],
  controllers: [KeysController],
  exports: [KeysService],
})
export class KeysModule {}
