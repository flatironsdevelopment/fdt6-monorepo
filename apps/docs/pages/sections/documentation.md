# Documentation

## Preview

```bash
yarn dev
```

We currently have multiple documentation pages:

- [Endpoints](../assets//redocly.html)
  - Open API Specification for our api endpoints.
  - [Swagger version](http://localhost:3000/docs)
  - [Postman Collection](../assets//monorepo.postman_collection.json)

## Creating a new documentation entry

On the Docs folder, run:

```bash
yarn docs:new
```

This command will generate a new file inside `/docs/sections/`. And it will modify the `_sidebard.md` file appending your newry added section.

Don't use this command to add new documentation about an existing topic, instead modify existing sections appending sub section by using `##`.
