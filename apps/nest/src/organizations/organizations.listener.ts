import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EventOperation,
  UserCreatedWithOrganizationEvent,
} from 'src/common/constants/events';
import { OrganizationsService } from './organizations.service';

@Injectable()
export class OrganizationsListener {
  private readonly logger = new Logger(OrganizationsListener.name);
  constructor(private readonly organizationsService: OrganizationsService) {}

  @OnEvent(EventOperation.USER_CREATED_WITH_ORGANIZATION)
  handleCreateOrganizationEvent(event: UserCreatedWithOrganizationEvent) {
    this.logger.log(
      `Creating organization ${event.organizationName} for user ${event.userEmail} with userId ${event.userId}`,
    );
    this.organizationsService.create({
      id: event.userId,
      name: event.organizationName,
    });
  }
}
