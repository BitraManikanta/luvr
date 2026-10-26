import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { nanoid } from 'nanoid';
import type { AuthTokens } from '@luvora/shared-types';

const SALT_ROUNDS = 12;

interface RegisterParams {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

interface LoginParams {
  identifier: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(params: RegisterParams): Promise<{ tokens: AuthTokens; userId: string }> {
    const existing = await this.usersService.findByUsernameOrEmail(
      params.username,
      params.email,
    );
    if (existing) {
      throw new ConflictException('Username or email already in use.');
    }

    const passwordHash = await bcrypt.hash(params.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      username: params.username,
      displayName: params.displayName,
      email: params.email,
      passwordHash,
    });

    const tokens = await this.generateTokens(user.id, user.username);
    return { tokens, userId: user.id };
  }

  async login(params: LoginParams): Promise<{ tokens: AuthTokens; userId: string }> {
    const user = await this.usersService.findByUsernameOrEmail(
      params.identifier,
      params.identifier,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordValid = await bcrypt.compare(params.password, user.passwordHash);
    if (!passwordValid) {
      // Constant-time comparison already done above; explicit check here
      throw new UnauthorizedException('Invalid credentials.');
    }

    const tokens = await this.generateTokens(user.id, user.username);
    return { tokens, userId: user.id };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<{ sub: string; username: string; type: string }>(
        refreshToken,
        { secret: this.configService.getOrThrow('JWT_REFRESH_SECRET') },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type.');
      }

      return this.generateTokens(payload.sub, payload.username);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  private async generateTokens(userId: string, username: string): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, jti: nanoid() },
        {
          secret: this.configService.getOrThrow('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, type: 'refresh', jti: nanoid() },
        {
          secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // seconds
    };
  }
}
