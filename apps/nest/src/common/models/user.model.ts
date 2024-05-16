import { User } from '~types';

export interface UserData extends User {}

export interface UserModel {
  data: UserData;

  mapToUser(data: any): User;
}
