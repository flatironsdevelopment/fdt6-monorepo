# Database Operations

At our core, we rely on TypeORM as a robust abstraction layer for managing our database operations. To ensure seamless integration, we support various databases listed within the `DatabaseProviders` enum.

## Entities

For detailed insights into our entity models, kindly refer to our [Entity Documentation](https://typeorm.io/entities).

All entity definitions reside within the `src/common/database/entities` directory.

### Creating a New Entity

```bash
yarn database:entity:create Organization
```

> Upon execution, remember to navigate to the newly created file and update its contents as needed.

### Importing an Entity

```javascript
// Within the module's imports
{
  // ...
  imports: [TypeOrmModule.forFeature([Organization])],
  // ...
}
```

## Subscribers

To streamline event handling, we employ subscribers as detailed in our [Subscriber Documentation](https://typeorm.io/listeners-and-subscribers#what-is-a-subscriber).

All subscriber implementations can be found within the `src/common/database/subscribers` directory.

### Creating a New Subscriber

```bash
yarn database:subscriber:create Organization
```

> After creation, ensure to customize the generated file according to your requirements.

### Importing a Subscriber

```javascript
// Within the providers' imports
{
  // ...
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrganizationSubscriber] // <-- Added
  // ...
}
```

## Migrations

Our migration scripts reside in the `src/common/database/migrations` directory.

For detailed information on migration procedures, please refer to the [Migrations Section](/sections/database/migrations?id=migrations).
