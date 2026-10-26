import {
  Injectable,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { EncryptedEnvelopeEntity } from './encrypted-envelope.entity';
import { ConversationsService } from '../conversations/conversations.service';

interface SendEnvelopeParams {
  conversationId: string;
  senderDeviceId: string;
  recipientDeviceId: string;
  ciphertext: string;
  messageType: number;
  idempotencyKey: string;
  expiresAt?: Date;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(EncryptedEnvelopeEntity)
    private readonly envelopeRepo: Repository<EncryptedEnvelopeEntity>,
    private readonly conversationsService: ConversationsService,
  ) {}

  /**
   * Store an encrypted envelope.
   * The ciphertext is opaque — we do not inspect it.
   */
  async sendEnvelope(
    senderUserId: string,
    params: SendEnvelopeParams,
  ): Promise<EncryptedEnvelopeEntity> {
    // Verify the sender is a participant
    await this.conversationsService.getForUser(params.conversationId, senderUserId);

    // Idempotency check
    const existing = await this.envelopeRepo.findOne({
      where: { idempotencyKey: params.idempotencyKey },
    });
    if (existing) {
      // Already stored — return the existing record (duplicate send prevention)
      return existing;
    }

    const envelope = this.envelopeRepo.create({
      ...params,
      isDelivered: false,
    });

    const saved = await this.envelopeRepo.save(envelope);

    // Touch the conversation's updatedAt for ordering
    // (ConversationsService handles this via DB trigger or explicit update)

    return saved;
  }

  /** Fetch undelivered envelopes destined for a device. */
  async fetchPending(recipientDeviceId: string): Promise<EncryptedEnvelopeEntity[]> {
    return this.envelopeRepo.find({
      where: { recipientDeviceId, isDelivered: false },
      order: { createdAt: 'ASC' },
      take: 100,
    });
  }

  /** Mark envelope(s) as delivered. */
  async acknowledge(envelopeIds: string[], recipientDeviceId: string): Promise<void> {
    if (envelopeIds.length === 0) return;

    await this.envelopeRepo
      .createQueryBuilder()
      .update()
      .set({ isDelivered: true, deliveredAt: new Date() })
      .where('id IN (:...ids) AND recipientDeviceId = :recipientDeviceId', {
        ids: envelopeIds,
        recipientDeviceId,
      })
      .execute();
  }

  /** Get paginated messages for a conversation (envelope metadata only — not ciphertext for list). */
  async listEnvelopes(
    conversationId: string,
    userId: string,
    cursor?: string,
    limit = 50,
  ): Promise<EncryptedEnvelopeEntity[]> {
    await this.conversationsService.getForUser(conversationId, userId);

    const qb = this.envelopeRepo
      .createQueryBuilder('e')
      .where('e.conversationId = :conversationId', { conversationId })
      .orderBy('e.createdAt', 'DESC')
      .take(limit);

    if (cursor) {
      const cursorDate = new Date(cursor);
      qb.andWhere('e.createdAt < :cursor', { cursor: cursorDate });
    }

    return qb.getMany();
  }

  /** Purge expired envelopes (called by a scheduled job). */
  async purgeExpired(): Promise<number> {
    const result = await this.envelopeRepo.delete({
      expiresAt: LessThan(new Date()),
    });
    return result.affected ?? 0;
  }
}
