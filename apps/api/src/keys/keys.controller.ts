import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KeysService } from './keys.service';
import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

class RegisterDeviceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  platform!: 'ios' | 'android' | 'web';

  @IsString()
  @IsNotEmpty()
  identityKeyPublic!: string;

  @IsNumber()
  registrationId!: number;
}

class UploadPrekeysDto {
  signedPrekey!: { keyId: number; publicKey: string; signature: string };
  oneTimePrekeys!: Array<{ keyId: number; publicKey: string }>;
}

class UpdatePushTokenDto {
  @IsString()
  @IsNotEmpty()
  pushToken!: string;

  @IsString()
  pushPlatform!: 'fcm' | 'apns';
}

@Controller('keys')
@UseGuards(AuthGuard('jwt'))
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post('devices')
  registerDevice(
    @Body() dto: RegisterDeviceDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.keysService.registerDevice({ userId: req.user.id, ...dto });
  }

  @Get('devices')
  getMyDevices(@Request() req: { user: { id: string } }) {
    return this.keysService.getDevicesForUser(req.user.id);
  }

  @Delete('devices/:deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  revokeDevice(
    @Param('deviceId') deviceId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.keysService.revokeDevice(deviceId, req.user.id);
  }

  @Post('devices/:deviceId/prekeys')
  @HttpCode(HttpStatus.NO_CONTENT)
  uploadPrekeys(
    @Param('deviceId') deviceId: string,
    @Body() dto: UploadPrekeysDto,
  ) {
    return this.keysService.uploadPrekeys(deviceId, dto.signedPrekey, dto.oneTimePrekeys);
  }

  @Get('prekey-bundle/:targetDeviceId')
  getPrekeyBundle(@Param('targetDeviceId') targetDeviceId: string) {
    return this.keysService.getPrekeyBundle(targetDeviceId);
  }

  @Post('devices/:deviceId/push-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePushToken(
    @Param('deviceId') deviceId: string,
    @Body() dto: UpdatePushTokenDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.keysService.updatePushToken(
      deviceId,
      req.user.id,
      dto.pushToken,
      dto.pushPlatform,
    );
  }
}
