import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { SignedPrekeyEntity, OneTimePrekeyEntity } from './prekey.entity';

interface RegisterDeviceParams {
  userId: string;
  name: string;
  platform: 'ios' | 'android' | 'web';
  identityKeyPublic: string;
  registrationId: number;
}

@Injectable()
export class KeysService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepo: Repository<DeviceEntity>,
    @InjectRepository(SignedPrekeyEntity)
    private readonly signedPrekeyRepo: Repository<SignedPrekeyEntity>,
    @InjectRepository(OneTimePrekeyEntity)
    private readonly otpRepo: Repository<OneTimePrekeyEntity>,
  ) {}

  async registerDevice(params: RegisterDeviceParams): Promise<DeviceEntity> {
    const device = this.deviceRepo.create({
      userId: params.userId,
      name: params.name,
      platform: params.platform,
      identityKeyPublic: params.identityKeyPublic,
      registrationId: params.registrationId,
    });
    return this.deviceRepo.save(device);
  }

  async uploadPrekeys(
    deviceId: string,
    signedPrekey: { keyId: number; publicKey: string; signature: string },
    oneTimePrekeys: Array<{ keyId: number; publicKey: string }>,
  ): Promise<void> {
    // Replace the existing signed prekey
    await this.signedPrekeyRepo.delete({ deviceId });
    const sp = this.signedPrekeyRepo.create({ deviceId, ...signedPrekey });
    await this.signedPrekeyRepo.save(sp);

    if (oneTimePrekeys.length > 0) {
      const otps = oneTimePrekeys.map((otp) =>
        this.otpRepo.create({ deviceId, ...otp }),
      );
      await this.otpRepo.save(otps);
    }
  }

  /**
   * Retrieve a prekey bundle for a target device.
   * Consumes one one-time prekey (if available).
   */
  async getPrekeyBundle(targetDeviceId: string) {
    const device = await this.deviceRepo.findOne({
      where: { id: targetDeviceId, isRevoked: false },
    });
    if (!device) throw new NotFoundException('Device not found or revoked.');

    const signedPrekey = await this.signedPrekeyRepo.findOne({
      where: { deviceId: targetDeviceId },
    });
    if (!signedPrekey) {
      throw new BadRequestException('No signed prekey available for this device.');
    }

    // Consume one one-time prekey (FIFO)
    const oneTimePrekey = await this.otpRepo.findOne({
      where: { deviceId: targetDeviceId, isConsumed: false },
      order: { createdAt: 'ASC' },
    });

    if (oneTimePrekey) {
      await this.otpRepo.update(oneTimePrekey.id, {
        isConsumed: true,
        consumedAt: new Date(),
      });
    }

    return {
      recipientDeviceId: device.id,
      identityKeyPublic: device.identityKeyPublic,
      registrationId: device.registrationId,
      signedPrekey: {
        keyId: signedPrekey.keyId,
        publicKey: signedPrekey.publicKey,
        signature: signedPrekey.signature,
      },
      oneTimePrekey: oneTimePrekey
        ? { keyId: oneTimePrekey.keyId, publicKey: oneTimePrekey.publicKey }
        : null,
    };
  }

  async getDevicesForUser(userId: string): Promise<DeviceEntity[]> {
    return this.deviceRepo.find({
      where: { userId, isRevoked: false },
      order: { createdAt: 'ASC' },
    });
  }

  async revokeDevice(deviceId: string, userId: string): Promise<void> {
    const device = await this.deviceRepo.findOne({ where: { id: deviceId, userId } });
    if (!device) throw new NotFoundException('Device not found.');
    await this.deviceRepo.update(deviceId, { isRevoked: true });
  }

  async updatePushToken(
    deviceId: string,
    userId: string,
    pushToken: string,
    pushPlatform: 'fcm' | 'apns',
  ): Promise<void> {
    const device = await this.deviceRepo.findOne({ where: { id: deviceId, userId } });
    if (!device) throw new NotFoundException('Device not found.');
    await this.deviceRepo.update(deviceId, { pushToken, pushPlatform });
  }

  async getRemainingOtpCount(deviceId: string): Promise<number> {
    return this.otpRepo.count({ where: { deviceId, isConsumed: false } });
  }
}
