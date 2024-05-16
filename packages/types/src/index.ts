export interface User {
  id: string
  email: string
  firstName: string
  phoneNumber?: string
  lastName: string
  emailVerified?: boolean
  phoneNumberVerified?: boolean
  mfaConfig?: {
    preferredSetting: string
    settingList: string[]
  }
}

export interface PaginationBase {
  current: number
  limit: number
  totalCount: number
  totalPages: number
}

export interface PaginationData extends PaginationBase {
  next?: string | null
  previous?: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationData
}

export interface PaginationOptions {
  current: number
  limit: number
}

export enum OrganizationMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

export enum OrganizationInvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REVOKED = 'revoked'
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: string
  createdAt: string
  updatedAt: string
  email: string
  firstName: string
  lastName: string
}

export interface OrganizationInvitation {
  id: string
  organizationId: string
  email: string
  status: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  message: string
  error: string
  statusCode: number
}
