import { Injectable, PipeTransform } from '@nestjs/common';
import { UserData } from '../models/user.model';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class UserPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: UserData) {
    const user = await this.userService.findByProviderId(value.id);

    if (!user) return null;

    // TODO: Types for returned user, remap to UserData and remove duplicates
    return { ...user, providerInfo: value };
  }
}
