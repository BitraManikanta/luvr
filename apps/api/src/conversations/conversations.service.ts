import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { ConversationParticipantEntity } from './conversation-participant.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly convRepo: Repository<ConversationEntity>,
    @InjectRepository(ConversationParticipantEntity)
    private readonly participantRepo: Repository<ConversationParticipantEntity>,
  ) {}

  /** Get all non-archived conversations for a user, ordered by updatedAt desc. */
  async listForUser(userId: string): Promise<ConversationEntity[]> {
    const participantRows = await this.participantRepo.find({
      where: { userId, isArchived: false },
      select: ['conversationId'],
    });

    if (participantRows.length === 0) return [];

    const ids = participantRows.map((p) => p.conversationId);

    return this.convRepo.find({
      where: { id: In(ids) },
      relations: ['participants'],
      order: { updatedAt: 'DESC' },
    });
  }

  /** Get a single conversation, verifying the requesting user is a member. */
  async getForUser(conversationId: string, userId: string): Promise<ConversationEntity> {
    const conversation = await this.convRepo.findOne({
      where: { id: conversationId },
      relations: ['participants'],
    });

    if (!conversation) throw new NotFoundException('Conversation not found.');

    const isMember = conversation.participants.some((p) => p.userId === userId);
    if (!isMember) throw new ForbiddenException('You are not a participant in this conversation.');

    return conversation;
  }

  /** Find or create a direct conversation between two users. */
  async findOrCreateDirect(
    userAId: string,
    userBId: string,
  ): Promise<{ conversation: ConversationEntity; created: boolean }> {
    // Check for existing direct conversation between the two users
    const existing = await this.convRepo
      .createQueryBuilder('conv')
      .innerJoin('conv.participants', 'pa', 'pa.userId = :userAId', { userAId })
      .innerJoin('conv.participants', 'pb', 'pb.userId = :userBId', { userBId })
      .where('conv.type = :type', { type: 'direct' })
      .getOne();

    if (existing) {
      return { conversation: existing, created: false };
    }

    const conversation = this.convRepo.create({ type: 'direct' });
    await this.convRepo.save(conversation);

    const participants = [userAId, userBId].map((uid) =>
      this.participantRepo.create({
        conversationId: conversation.id,
        userId: uid,
        role: 'member',
      }),
    );
    await this.participantRepo.save(participants);

    // Reload with relations
    const loaded = await this.convRepo.findOne({
      where: { id: conversation.id },
      relations: ['participants'],
    });

    return { conversation: loaded!, created: true };
  }

  /** Create a group conversation. */
  async createGroup(
    creatorId: string,
    name: string,
    memberIds: string[],
  ): Promise<ConversationEntity> {
    const allIds = Array.from(new Set([creatorId, ...memberIds]));

    const conversation = this.convRepo.create({ type: 'group', name });
    await this.convRepo.save(conversation);

    const participants = allIds.map((uid) =>
      this.participantRepo.create({
        conversationId: conversation.id,
        userId: uid,
        role: uid === creatorId ? 'admin' : 'member',
      }),
    );
    await this.participantRepo.save(participants);

    return this.convRepo.findOne({
      where: { id: conversation.id },
      relations: ['participants'],
    }) as Promise<ConversationEntity>;
  }

  async markAsRead(conversationId: string, userId: string, lastMessageId: string): Promise<void> {
    await this.participantRepo.update(
      { conversationId, userId },
      { lastReadMessageId: lastMessageId, lastReadAt: new Date() },
    );
  }

  async archiveConversation(conversationId: string, userId: string): Promise<void> {
    await this.assertMember(conversationId, userId);
    await this.participantRepo.update({ conversationId, userId }, { isArchived: true });
  }

  async muteConversation(
    conversationId: string,
    userId: string,
    muted: boolean,
  ): Promise<void> {
    await this.assertMember(conversationId, userId);
    await this.participantRepo.update({ conversationId, userId }, { isMuted: muted });
  }

  private async assertMember(conversationId: string, userId: string): Promise<void> {
    const p = await this.participantRepo.findOne({ where: { conversationId, userId } });
    if (!p) throw new ForbiddenException('Not a participant.');
  }
}
