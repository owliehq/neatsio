# Endpoints

Once you have defined and registered all your models, endpoints should be available through the router you've been set on your express app.

## How endpoints are built

Your endpoints are settled to defined path when you've called `app.use` (default: root path `/`).

Each model have a specific path, based on the main router level if you apply Neatsio's routes at this level. Then, Model's name is lowercased and pluralized.

For example:
- `User` model becomes `users`
- `City` model becomes `cities`

With this established, we can build our endpoints. Continue with this example:

We register the neatsio routes at `/api` path, and we have 3 models named  `User`, `Car` and `City`. 3 main endpoints are now availables:

- `/api/users`
- `/api/cars`
- `/api/cities`

## Available endpoints

Each main endpoint is split into many routes to respect REST architecture, let's explain these with `Car` model example.

| Method       | Endpoint       | Description | Data Format |
| ------------ | -------------- | ----------- | ----------- |
| **`GET`**    | `/cars`        | Get list of cars | *`Array<Car>`* |
| **`GET`**    | `/cars/1`      | Get specific car with id equals to 1 | *`Car`* |
| **`GET`**    | `/cars/count`  | Get count of cars in database | *`Number`* |
| **`POST`**   | `/cars`        | Create new car | *`Car`* |
| **`PUT`**    | `/cars/1`      | Update a car at specified id | *`Car`* |
| **`DELETE`** | `/cars/1`      | Delete a car at specified id |  |
| **`PUT`**    | `/cars/bulk`   | Update all cars |  |
| **`DELETE`** | `/cars/bulk`   | Delete all cars |  |
