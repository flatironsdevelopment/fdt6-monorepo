# Pagination

Pagination is controlled by the params `limit` (the amount of items per page) and `current` (the current page been returned in the data array).

In order to create paginated endpoints there are main changes to be apply:

## Controller level

`@PaginatedEndpoint(Model)` decorator, this decorator automatically adds documentation for the documentation endpoint, transforms the paginatedData to paginated response adding the routes for the next and previous pages.

`@Query() query: PaginationOptions` validated query properties, in case of needing extra params, make sure to extend from the `PaginationOptions` class.

## Service level

`addPaginationToQuery` apply pagination filters to the repository query, returns the same query instance for further filtering.

`getPaginatedResult` using the paginatedQuery returns the results mapped to a pagination ready format. This result is used by the `@PaginatedEndpoint(Model)` to return the correct paginated response.
