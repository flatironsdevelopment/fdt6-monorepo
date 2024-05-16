# Organization API

The Organization API module provides a set of hooks for managing organizational data and interactions within your application. These hooks offer functionalities related to organization CRUD operations, member management, and invitations.

> These Hooks depends on the Api [Authentication Hooks](/sections/hooks/api-authentication.md).

## Provider

To utilize the functionalities provided by the Organization API module, you need to wrap your application components with the `OrganizationsProvider` component. This component establishes the context for managing organizational data and interactions within your application.

```javascript
import { OrganizationsProvider } from 'organization-api'
// Make sure this providers is a child of the AuthProvider
return (
  <OrganizationsProvider>
    {/* Your application components */}
  </OrganizationsProvider>
)
```

## `useOrganizationsContext()`

The `useOrganizationsContext()` hook provides access to the context values related to organizations, members, and invitations within your application. It allows you to retrieve essential information and states for managing organization-related data and interactions.

### Usage

```javascript
import { useOrganizationsContext } from 'organization-api';

const MyComponent = () => {
  const {
    memberId,
    organizationId,
    organizationsState,
    invitationsState,
    membersState,
    setOrganizationId
  } = useOrganizationsContext();

  // Your component logic here...

  return (
    // Your component JSX
  );
};
```

It seems like you're documenting methods related to organizations, including hooks and their usage. Here's how you can refine and expand upon the documentation:

## Organizations

In this section, we provide documentation for methods related to organizations, including hooks and their associated functionalities.

### Organization List

```javascript
const {
  // Organization List Methods
  refetchOrganizations,
  organizationsState,
  createOrganization,
  createOrganizationState
} = useOrganizationsContext()
```

- `refetchOrganizations`: A function to refetch the list of organizations.
- `organizationsState`: The state object containing data related to organizations.
- `createOrganization`: A function to create a new organization.
- `createOrganizationState`: The state object representing the current state of the organization creation process.

#### `useOrganizationsPagination(options?)`

The `useOrganizationsPagination()` hook manages pagination for organizations. It provides controls for navigating through paginated lists of organizations.

```javascript
const { current, limit, setPage, changeLimit, goToNextPage, goToPreviousPage } =
  useOrganizationsPagination(options)
```

- `current`: The current page number.
- `limit`: The number of items per page.
- `setPage`: A function to set the current page.
- `changeLimit`: A function to change the number of items per page.
- `goToNextPage`: A function to navigate to the next page.
- `goToPreviousPage`: A function to navigate to the previous page.

### Organization Details

In this section, we describe methods related to fetching and managing details of specific organizations.

#### Setting Organization ID

By setting the `organizationId` using the `setOrganizationId` method, the data of the organization is automatically fetched and returned in the `organizationDetailsState`.

```javascript
const {
  // Organization Details Methods
  organizationId,
  refetchOrganizationDetails,
  organizationDetailsState,
  editOrganization,
  editOrganizationState,
  setOrganizationId
} = useOrganizationsContext()
```

#### Organization Details Methods

- `organizationId`: The ID of the current organization.
- `refetchOrganizationDetails`: A function to refetch the details of the current organization.
- `organizationDetailsState`: The state object containing data related to the details of the current organization.
- `editOrganization`: A function to edit the details of a specific organization.
- `editOrganizationState`: The state object representing the current state of the organization editing process.
- `setOrganizationId`: A function to set the ID of the organization for which details are to be fetched.

## Organization Members

In this section, we describe methods related to managing organization members.

### Organization Members List

By using the `useOrganizationsContext()` hook, you can access methods related to fetching and managing the list of organization members.

```javascript
const {
  // Member list related methods
  refetchMembers,
  membersState
} = useOrganizationsContext()
```

- `refetchMembers`: A function to refetch the list of organization members.
- `membersState`: The state object containing data related to organization members.

#### `useOrganizationMembersPagination(options?)`

The `useOrganizationMembersPagination()` hook manages pagination for organization members. It provides controls for navigating through paginated lists of members within an organization.

```javascript
const { current, limit, setPage, changeLimit, goToNextPage, goToPreviousPage } =
  useOrganizationMembersPagination(options)
```

- `current`: The current page number.
- `limit`: The number of items per page.
- `setPage`: A function to set the current page.
- `changeLimit`: A function to change the number of items per page.
- `goToNextPage`: A function to navigate to the next page.
- `goToPreviousPage`: A function to navigate to the previous page.

### Organization Member Details

In this section, we describe methods related to fetching and managing details of specific organization members.

#### Setting Organization Member ID

By setting the `memberId` using the `setMemberId` method, the data of the organization member is automatically fetched and returned in the `memberDetailsState`.

```javascript
const {
  // Organization Member Details Methods
  setMemberId,
  memberId,
  editMember,
  editMemberState,
  refetchMemberDetails,
  memberDetailsState,
  deleteMember,
  deleteMemberState
} = useOrganizationsContext()
```

#### Organization Member Details Methods

- `setMemberId`: A function to set the ID of the organization member for which details are to be fetched.
- `memberId`: The ID of the current organization member.
- `editMember`: A function to edit the details of a specific organization member.
- `editMemberState`: The state object representing the current state of the organization member editing process.
- `refetchMemberDetails`: A function to refetch the details of the current organization member.
- `memberDetailsState`: The state object containing data related to the details of the current organization member.
- `deleteMember`: A function to delete a specific organization member.
- `deleteMemberState`: The state object representing the current state of the organization member deletion process.

<!-- INVITATIONS -->

## Organization Invitations

In this section, we describe methods related to managing organization invitations.

### Organization Invitations List

By using the `useOrganizationsContext()` hook, you can access methods related to fetching and managing the list of organization invitations.

```javascript
const {
  // Invitation list related methods
  refetchInvitations,
  invitationsState
} = useOrganizationsContext()
```

- `refetchInvitations`: A function to refetch the list of organization invitations.
- `invitationsState`: The state object containing data related to organization invitations.

#### `useOrganizationInvitationsPagination(options?)`

The `useOrganizationInvitationsPagination()` hook manages pagination for organization invitations. It provides controls for navigating through paginated lists of invitations within an organization.

```javascript
const { current, limit, setPage, changeLimit, goToNextPage, goToPreviousPage } =
  useOrganizationInvitationsPagination(options)
```

- `current`: The current page number.
- `limit`: The number of items per page.
- `setPage`: A function to set the current page.
- `changeLimit`: A function to change the number of items per page.
- `goToNextPage`: A function to navigate to the next page.
- `goToPreviousPage`: A function to navigate to the previous page.
  Here's the documentation for managing organization invitations:

### Managing Organization Invitation

In this section, we describe methods related to managing organization invitations.

```javascript
const {
  // Managing Invitation related methods
  // Create Invitation
  createInvitation,
  createInvitationState,

  // Confirm Invitation
  confirmInvitation,
  confirmInvitationState,

  // Resend Invitation
  resendInvitationState,
  resendInvitation,

  // Delete Invitation
  deleteInvitation,
  deleteInvitationState
} = useOrganizationsContext()
```

#### Create Invitation

- `createInvitation`: A function to create a new invitation.
- `createInvitationState`: The state object representing the current state of the invitation creation process.

#### Confirm Invitation

- `confirmInvitation`: A function to confirm an invitation.
- `confirmInvitationState`: The state object representing the current state of the invitation confirmation process.

#### Resend Invitation

- `resendInvitationState`: The state object representing the current state of the invitation resend process.
- `resendInvitation`: A function to resend an invitation.

#### Delete Invitation

- `deleteInvitation`: A function to delete an invitation.
- `deleteInvitationState`: The state object representing the current state of the invitation deletion process.
