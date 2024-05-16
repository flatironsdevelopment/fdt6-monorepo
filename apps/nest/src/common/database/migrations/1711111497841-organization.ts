import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';
import {
  OrganizationInvitationStatus,
  OrganizationMemberRole,
} from '../../@types/organization';

export class Organization1711111497841 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organization',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'organization_member',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            isNullable: false,
          },
          // Should the primary key be a composite key?
          {
            name: 'organization_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'role',
            type: 'enum',
            enum: [OrganizationMemberRole.ADMIN, OrganizationMemberRole.MEMBER],
            isNullable: false,
            enumName: 'organization_member_role',
            default: `'${OrganizationMemberRole.MEMBER}'`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'organization_member_organization_id_fkey',
            columnNames: ['organization_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'organization',
            onDelete: 'CASCADE',
          },
          {
            name: 'organization_member_user_id_fkey',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // Add unique constraint to organization_member table
    await queryRunner.createUniqueConstraint(
      'organization_member',
      new TableUnique({
        name: 'organization_member_organization_id_user_id_unique',
        columnNames: ['organization_id', 'user_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'organization_invitation',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            isNullable: false,
          },
          {
            name: 'organization_id',
            type: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'role',
            type: 'enum',
            isNullable: false,
            enumName: 'organization_member_role',
            default: `'${OrganizationMemberRole.MEMBER}'`,
          },
          {
            name: 'status',
            type: 'enum',
            isNullable: false,
            enum: [
              OrganizationInvitationStatus.ACCEPTED,
              OrganizationInvitationStatus.PENDING,
              OrganizationInvitationStatus.REVOKED,
            ],
            enumName: 'organization_invitation_status',
            default: `'${OrganizationInvitationStatus.PENDING}'`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'organization_invitation_organization_id_fkey',
            columnNames: ['organization_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'organization',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // Add unique constraint to organization_invitation table
    await queryRunner.createUniqueConstraint(
      'organization_invitation',
      new TableUnique({
        name: 'organization_invitation_organization_id_email_unique',
        columnNames: ['organization_id', 'email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const invitationsTable = await queryRunner.getTable(
      'organization_invitation',
    );

    if (invitationsTable) {
      const organizationIdForeignKey = invitationsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('organization_id') !== -1,
      );

      await queryRunner.dropForeignKey(
        invitationsTable,
        organizationIdForeignKey,
      );

      await queryRunner.dropTable(invitationsTable, true);
    }

    const memberTable = await queryRunner.getTable('organization_member');
    if (memberTable) {
      const organizationIdForeignKey = memberTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('organization_id') !== -1,
      );
      const userIdForeignKey = memberTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('user_id') !== -1,
      );

      await queryRunner.dropForeignKey(memberTable, organizationIdForeignKey);
      await queryRunner.dropForeignKey(memberTable, userIdForeignKey);
    }
    await queryRunner.dropTable(memberTable, true);

    await queryRunner.dropTable('organization', true);
  }
}
