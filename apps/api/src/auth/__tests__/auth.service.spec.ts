import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockUsersService = {
  findByUsernameOrEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mock_token'),
};

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('test_secret'),
  get: jest.fn().mockReturnValue('15m'),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ---- Registration -------------------------------------------------------

  describe('register', () => {
    it('throws ConflictException when username or email already exists', async () => {
      mockUsersService.findByUsernameOrEmail.mockResolvedValue({ id: 'existing-user' });

      await expect(
        service.register({
          username: 'existing',
          displayName: 'Existing',
          email: 'exists@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('creates a new user and returns tokens', async () => {
      mockUsersService.findByUsernameOrEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ id: 'new-user-id', username: 'newuser' });

      const result = await service.register({
        username: 'newuser',
        displayName: 'New User',
        email: 'new@test.com',
        password: 'password123',
      });

      expect(result.userId).toBe('new-user-id');
      expect(result.tokens.accessToken).toBe('mock_token');
      expect(result.tokens.refreshToken).toBe('mock_token');
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
    });

    it('hashes the password before storing', async () => {
      mockUsersService.findByUsernameOrEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({ id: 'uid', username: 'user' });

      await service.register({
        username: 'user',
        displayName: 'User',
        email: 'u@test.com',
        password: 'plaintext_password',
      });

      const createCall = mockUsersService.create.mock.calls[0]?.[0];
      expect(createCall).toBeDefined();
      expect(createCall.passwordHash).not.toBe('plaintext_password');

      // Verify it's a valid bcrypt hash
      const valid = await bcrypt.compare('plaintext_password', createCall.passwordHash);
      expect(valid).toBe(true);
    });
  });

  // ---- Login --------------------------------------------------------------

  describe('login', () => {
    it('throws UnauthorizedException for unknown user', async () => {
      mockUsersService.findByUsernameOrEmail.mockResolvedValue(null);

      await expect(
        service.login({ identifier: 'ghost', password: 'anything' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correct_password', 12);
      mockUsersService.findByUsernameOrEmail.mockResolvedValue({
        id: 'user-id',
        username: 'user',
        passwordHash: hash,
      });

      await expect(
        service.login({ identifier: 'user', password: 'wrong_password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens for correct credentials', async () => {
      const hash = await bcrypt.hash('correct_password', 12);
      mockUsersService.findByUsernameOrEmail.mockResolvedValue({
        id: 'user-id',
        username: 'user',
        passwordHash: hash,
      });

      const result = await service.login({
        identifier: 'user',
        password: 'correct_password',
      });

      expect(result.userId).toBe('user-id');
      expect(result.tokens.accessToken).toBeDefined();
    });
  });
});
