# Migrations

Learn more [here](https://typeorm.io/migrations).

## Create a migration

This command facilitates the creation of a new database migration file.

```bash
yarn database:migration:create
```

> This command triggers the execution of a bash script named `create-migration.sh`, which generates a fresh migration file tailored for the database.

## Run Migrations

This command orchestrates the execution of database migrations.

```bash
yarn database:migration:run
```

> This command activates a bash script named `run-migrations.sh`, which initiates the database migration process. It requires `postgres.ts` as an argument to indicate the target database type.

## Revert last migration

This command facilitates the reversal of database migrations.

```bash
yarn database:migration:revert
```

> This command triggers the execution of a bash script named `revert-migrations.sh`, which undoes the most recently applied database migration. Similar to the previous command, it necessitates `postgres.ts` as an argument to specify the target database type.
