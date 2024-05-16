import { AuthProviderName } from 'src/common/modules/auth/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User as IUser } from '~types';

@Entity()
export class User implements Partial<IUser> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'email',
    unique: true,
  })
  email: string;

  @Column({
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    name: 'provider_id',
  })
  providerId: string;

  @Column({
    enum: AuthProviderName,
  })
  provider: AuthProviderName;

  @UpdateDateColumn({
    name: 'updated_at',
    default: 'now()',
  })
  updatedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    default: 'now()',
  })
  createdAt: Date;

  static mapToClient(
    user: User & {
      providerInfo: Pick<
        IUser,
        'mfaConfig' | 'emailVerified' | 'phoneNumberVerified'
      >;
    },
  ): IUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      emailVerified: user.providerInfo?.emailVerified,
      phoneNumberVerified: user.providerInfo?.phoneNumberVerified,
      mfaConfig: user.providerInfo?.mfaConfig,
    };
  }
}
