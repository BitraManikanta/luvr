import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

interface CreateUserParams {
  username: string;
  displayName: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(params: CreateUserParams): Promise<UserEntity> {
    const user = this.repo.create(params);
    return this.repo.save(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id, isDeleted: false } });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { username, isDeleted: false } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email, isDeleted: false } });
  }

  /** Find by username OR email. Used for login. */
  async findByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<(UserEntity & { passwordHash: string }) | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('(user.username = :username OR user.email = :email) AND user.isDeleted = false', {
        username,
        email,
      })
      .getOne() as Promise<(UserEntity & { passwordHash: string }) | null>;
  }

  async getProfile(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async updateProfile(
    id: string,
    updates: Partial<Pick<UserEntity, 'displayName' | 'bio' | 'avatarUrl' | 'isPrivate'>>,
  ): Promise<UserEntity> {
    await this.repo.update(id, updates);
    return this.getProfile(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.update(id, { isDeleted: true, deletedAt: new Date() });
  }
}
