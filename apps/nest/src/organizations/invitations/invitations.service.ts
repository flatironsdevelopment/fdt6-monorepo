import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationInvitationStatus } from 'src/common/@types/organization';
import { PaginationOptions } from 'src/common/@types/pagination';
import { EventOperation, SendEmailEvent } from 'src/common/constants/events';
import { OrganizationInvitation } from 'src/common/database/entities/organization-invitation.entity';
import { OrganizationMember } from 'src/common/database/entities/organization-member.entity';
import { Organization } from 'src/common/database/entities/organization.entity';
import { MailTemplates } from 'src/common/modules/messaging/mail/mail.constants';
import { UserService } from 'src/common/modules/user/user.service';
import { EncryptionService } from 'src/common/services/encryption.service';
import {
  FrontEndPaths,
  generateFrontEndLink,
} from 'src/common/utils/front-end';
import {
  addPaginationToQuery,
  getPaginatedResult,
} from 'src/common/utils/pagination';
import { Repository } from 'typeorm';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ConfirmInvitationDto } from './dto/update-invitation.dto';

@Injectable()
export class OrganizationInvitationsService {
  constructor(
    @InjectRepository(OrganizationInvitation)
    private readonly invitationsRepository: Repository<OrganizationInvitation>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly memberRepository: Repository<OrganizationMember>,
    private readonly encryptionService: EncryptionService,
    private readonly eventEmitter2: EventEmitter2,
    private readonly userService: UserService,
  ) {}

  getOrganizationInvitationsQuery(organizationId: string) {
    return this.invitationsRepository
      .createQueryBuilder('organization_invitation')
      .where('organization_invitation.organizationId = :organizationId', {
        organizationId,
      })
      .orderBy('organization_invitation.createdAt', 'ASC');
  }

  async sendInvitationEmail(
    organizationId: string,
    invitationId: string,
    email: string,
  ) {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    const invitationToken = await this.encryptionService.encryptWithExpiration({
      invitationId: invitationId,
      organizationId: organizationId,
    });

    const user = await this.userService.findByEmail(email);

    this.eventEmitter2.emit(
      EventOperation.SEND_MAIL,
      new SendEmailEvent({
        type: MailTemplates.ORGANIZATION_INVITATION,
        options: {
          email: email,
          link: generateFrontEndLink(FrontEndPaths.ORGANIZATION_INVITATION, {
            token: invitationToken,
            organization: organization.id,
            email,
            isRegistered: !!user,
          }),
          organizationName: organization.name,
        },
      }),
    );
  }

  async create(
    createInvitationDto: CreateInvitationDto & { organizationId: string },
  ) {
    try {
      const user = await this.userService.findByEmail(
        createInvitationDto.email,
      );

      if (user) {
        const member = await this.memberRepository.findOne({
          where: {
            organizationId: createInvitationDto.organizationId,
            userId: user.id,
          },
        });

        if (member) {
          throw new ConflictException('User is already a member');
        }
      }

      const invitation = await this.invitationsRepository.save({
        organizationId: createInvitationDto.organizationId,
        email: createInvitationDto.email,
        status: OrganizationInvitationStatus.PENDING,
        role: createInvitationDto.role,
      });
      await this.sendInvitationEmail(
        invitation.organizationId,
        invitation.id,
        invitation.email,
      );

      return invitation;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Invitation already exists');
      }

      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException(error);
    }
  }

  async findAll(organizationId: string, options: PaginationOptions) {
    const builder = this.getOrganizationInvitationsQuery(organizationId);

    const query = addPaginationToQuery(builder, options);

    const invitations = await getPaginatedResult(query, options);
    return invitations;
  }

  async findOne(organizationId: string, id: string) {
    const invitations =
      await this.getOrganizationInvitationsQuery(organizationId);

    const invitation = await invitations.andWhereInIds([id]).getOne();

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation;
  }

  async confirm(confirmInvitationDto: ConfirmInvitationDto) {
    const invitationToken = await this.encryptionService.decryptWithExpiration<{
      invitationId: string;
      organizationId: string;
    }>(confirmInvitationDto.token);

    const invitation = await this.findOne(
      invitationToken.organizationId,
      invitationToken.invitationId,
    );

    invitation.status = OrganizationInvitationStatus.ACCEPTED;

    const user = await this.userService.findByEmail(invitation.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.memberRepository.insert({
      organizationId: invitation.organizationId,
      userId: user.id,
      role: invitation.role,
    });

    await this.invitationsRepository.save(invitation);
  }

  async resend(organizationId: string, id: string) {
    const invitation = await this.findOne(organizationId, id);

    await this.sendInvitationEmail(
      invitation.organizationId,
      invitation.id,
      invitation.email,
    );
  }

  async remove(organizationId: string, id: string) {
    const invitation = await this.findOne(organizationId, id);

    return await this.invitationsRepository.remove(invitation);
  }
}
