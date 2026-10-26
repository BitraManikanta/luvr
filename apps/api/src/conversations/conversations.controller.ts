import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConversationsService } from './conversations.service';
import { IsString, IsArray, IsUUID, ArrayMinSize } from 'class-validator';

class CreateDirectDto {
  @IsUUID()
  recipientId!: string;
}

class CreateGroupDto {
  @IsString()
  name!: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  memberIds!: string[];
}

class MarkReadDto {
  @IsUUID()
  lastMessageId!: string;
}

@Controller('conversations')
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  list(@Request() req: { user: { id: string } }) {
    return this.conversationsService.listForUser(req.user.id);
  }

  @Get(':id')
  get(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.conversationsService.getForUser(id, req.user.id);
  }

  @Post('direct')
  createDirect(
    @Body() dto: CreateDirectDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.conversationsService.findOrCreateDirect(req.user.id, dto.recipientId);
  }

  @Post('group')
  createGroup(
    @Body() dto: CreateGroupDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.conversationsService.createGroup(req.user.id, dto.name, dto.memberIds);
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  markRead(
    @Param('id') id: string,
    @Body() dto: MarkReadDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.conversationsService.markAsRead(id, req.user.id, dto.lastMessageId);
  }
}
