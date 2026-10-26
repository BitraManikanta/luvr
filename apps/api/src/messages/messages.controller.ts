import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsISO8601,
  IsUUID,
  IsArray,
  Max,
  Min,
} from 'class-validator';

class SendEnvelopeDto {
  @IsUUID()
  conversationId!: string;

  @IsString()
  @IsNotEmpty()
  senderDeviceId!: string;

  @IsString()
  @IsNotEmpty()
  recipientDeviceId!: string;

  @IsString()
  @IsNotEmpty()
  ciphertext!: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  messageType!: number;

  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string;

  @IsISO8601()
  @IsOptional()
  expiresAt?: string;
}

class AcknowledgeDto {
  @IsArray()
  @IsUUID('4', { each: true })
  envelopeIds!: string[];
}

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('send')
  async send(
    @Body() dto: SendEnvelopeDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.messagesService.sendEnvelope(req.user.id, {
      ...dto,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    });
  }

  @Get('conversations/:id')
  list(
    @Param('id') conversationId: string,
    @Query('cursor') cursor: string | undefined,
    @Query('limit') limit: string | undefined,
    @Request() req: { user: { id: string } },
  ) {
    return this.messagesService.listEnvelopes(
      conversationId,
      req.user.id,
      cursor,
      limit ? Math.min(parseInt(limit, 10), 100) : 50,
    );
  }

  @Post('acknowledge')
  @HttpCode(HttpStatus.NO_CONTENT)
  acknowledge(
    @Body() dto: AcknowledgeDto,
    @Request() req: { user: { id: string; deviceId?: string } },
  ) {
    // The device ID comes from the JWT in Phase 4; for now use a placeholder
    const deviceId = req.user.deviceId ?? 'unknown';
    return this.messagesService.acknowledge(dto.envelopeIds, deviceId);
  }
}
