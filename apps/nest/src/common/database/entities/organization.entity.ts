import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Organization {
  @ApiProperty({
    description: 'Unique identifier for the organization',
    example: 'f8b8b0e0-0f1b-4e5c-9b9c-6e1f5c9b2e6f',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the organization',
    example: 'Flatirons School',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the organization',
    example: 'A school for software engineering',
  })
  @CreateDateColumn({
    name: 'created_at',
    default: 'now()',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date the organization was last updated',
    example: '2021-07-01T00:00:00.000Z',
  })
  @UpdateDateColumn({
    name: 'updated_at',
    default: 'now()',
  })
  updatedAt: Date;
}
