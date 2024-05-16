import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/database/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthProviderName } from '../auth/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    provider: AuthProviderName;
    providerId: string;
  }) {
    const user = await this.userRepository.insert(userData);

    return user.identifiers[0] as User;
  }

  async findByProviderId(providerId: string) {
    return this.userRepository.findOne({
      where: {
        providerId,
      },
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
}
