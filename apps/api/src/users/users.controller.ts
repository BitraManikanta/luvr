import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMyProfile(@Request() req: { user: { id: string } }) {
    return this.usersService.getProfile(req.user.id);
  }

  @Get(':username')
  getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Patch('me')
  updateProfile(
    @Request() req: { user: { id: string } },
    @Body() body: { displayName?: string; bio?: string; isPrivate?: boolean },
  ) {
    return this.usersService.updateProfile(req.user.id, body);
  }
}
