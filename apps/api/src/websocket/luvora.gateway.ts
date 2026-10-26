/**
 * LuvoraGateway — Socket.IO WebSocket gateway.
 *
 * Security model:
 * - Clients authenticate with a JWT on connection (handshake auth.token).
 * - Each user's socket is placed in their personal room (user:{userId}).
 * - Each conversation has a room (conv:{conversationId}).
 * - The server never broadcasts plaintext message content — only delivery events
 *   and the encrypted envelope itself (opaque to the server).
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  deviceId?: string;
}

interface SendMessagePayload {
  conversationId: string;
  recipientDeviceId: string;
  ciphertext: string;
  messageType: number;
  idempotencyKey: string;
  expiresAt?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000', 'http://localhost:8081'],
    credentials: true,
  },
  namespace: '/',
})
export class LuvoraGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(LuvoraGateway.name);

  // userId → Set of socketIds (one user can have multiple devices connected)
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService,
  ) {}

  // -------------------------------------------------------------------------
  // Connection lifecycle
  // -------------------------------------------------------------------------

  async handleConnection(socket: AuthenticatedSocket) {
    const token = socket.handshake.auth?.['token'] as string | undefined;

    if (!token) {
      this.logger.warn(`[WS] Unauthenticated connection attempt from ${socket.id}`);
      socket.emit('error', { code: 'UNAUTHORIZED', message: 'No token provided.' });
      socket.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify<{ sub: string; deviceId?: string }>(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      socket.userId = payload.sub;
      socket.deviceId = payload.deviceId;

      // Join personal room and presence room
      await socket.join(`user:${payload.sub}`);

      // Track connection
      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set());
      }
      this.userSockets.get(payload.sub)!.add(socket.id);

      this.logger.log(`[WS] User ${payload.sub} connected (socket ${socket.id})`);

      // Deliver any queued envelopes
      if (socket.deviceId) {
        const pending = await this.messagesService.fetchPending(socket.deviceId);
        if (pending.length > 0) {
          socket.emit('pending_envelopes', pending);
        }
      }
    } catch {
      this.logger.warn(`[WS] Invalid token from socket ${socket.id}`);
      socket.emit('error', { code: 'UNAUTHORIZED', message: 'Invalid token.' });
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    if (socket.userId) {
      const sockets = this.userSockets.get(socket.userId);
      sockets?.delete(socket.id);
      if (sockets?.size === 0) {
        this.userSockets.delete(socket.userId);
      }
      this.logger.log(`[WS] User ${socket.userId} disconnected (socket ${socket.id})`);
    }
  }

  // -------------------------------------------------------------------------
  // Message events
  // -------------------------------------------------------------------------

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: SendMessagePayload,
  ) {
    if (!socket.userId || !socket.deviceId) {
      return { error: 'Not authenticated.' };
    }

    try {
      const envelope = await this.messagesService.sendEnvelope(socket.userId, {
        conversationId: payload.conversationId,
        senderDeviceId: socket.deviceId,
        recipientDeviceId: payload.recipientDeviceId,
        ciphertext: payload.ciphertext,
        messageType: payload.messageType,
        idempotencyKey: payload.idempotencyKey,
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : undefined,
      });

      // Acknowledge to sender
      socket.emit('message_accepted', {
        idempotencyKey: payload.idempotencyKey,
        envelopeId: envelope.id,
        serverTimestamp: envelope.createdAt,
      });

      // Push to recipient's room — they receive the opaque encrypted envelope
      this.server.to(`user:${payload.recipientDeviceId}`).emit('new_envelope', {
        envelopeId: envelope.id,
        conversationId: envelope.conversationId,
        senderDeviceId: envelope.senderDeviceId,
        ciphertext: envelope.ciphertext,
        messageType: envelope.messageType,
        createdAt: envelope.createdAt,
      });

      return { ok: true, envelopeId: envelope.id };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Send failed';
      socket.emit('send_error', {
        idempotencyKey: payload.idempotencyKey,
        message,
      });
      return { error: message };
    }
  }

  @SubscribeMessage('acknowledge')
  async handleAcknowledge(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { envelopeIds: string[] },
  ) {
    if (!socket.deviceId) return;
    await this.messagesService.acknowledge(payload.envelopeIds, socket.deviceId);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { conversationId: string; isTyping: boolean },
  ) {
    if (!socket.userId) return;

    // Broadcast to all OTHER participants of the conversation
    socket.to(`conv:${payload.conversationId}`).emit('typing', {
      conversationId: payload.conversationId,
      userId: socket.userId,
      isTyping: payload.isTyping,
    });
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: { conversationId: string },
  ) {
    if (!socket.userId) return;
    // Verify membership before joining room
    try {
      await this.conversationsService.getForUser(payload.conversationId, socket.userId);
      await socket.join(`conv:${payload.conversationId}`);
      return { ok: true };
    } catch {
      return { error: 'Not a member.' };
    }
  }

  // -------------------------------------------------------------------------
  // Server-side push helpers (called by other services)
  // -------------------------------------------------------------------------

  /** Push a delivery receipt to the sender. */
  pushDeliveryReceipt(
    senderUserId: string,
    envelopeId: string,
    state: 'delivered' | 'read',
  ) {
    this.server.to(`user:${senderUserId}`).emit('delivery_receipt', {
      envelopeId,
      state,
      timestamp: new Date().toISOString(),
    });
  }

  /** Check if a user has at least one active socket. */
  isUserOnline(userId: string): boolean {
    return (this.userSockets.get(userId)?.size ?? 0) > 0;
  }
}
