# Endpoints

Once you have defined and registered all your models, the corresponding endpoints should be available through the router you've set on your express app.

## How endpoints are built

Your endpoints are settled to the specified path when you call `app.use` (default: root path `/`).

Each model have a specific path, based on the path of express router on which you apply Neatsio's routes. The model's name is lowercased and pluralized.

For example:
- `User` model becomes `users`
- `City` model becomes `cities`

Keeping this in mind, we can build our endpoints :

Register the neatsio routes at `/api` path, and creating 3 models named  `User`, `Car` and `City` lead to 3 available main endpoints:

- `/api/users`
- `/api/cars`
- `/api/cities`

## Available endpoints

A main endpoint is split into many routes to respect REST architecture, let's explain these with `Car` model example :

| Method       | Endpoint       | Neatsio Constant | Description | Data Format |
| ------------ | -------------- | ---------------- | ----------- | ----------- |
| **`GET`**    | `/cars`        | **GET_MANY**     | Get list of cars | *`Array<Car>`* |
| **`GET`**    | `/cars/1`      | **GET_ONE**      | Get specific car with id 1 | *`Car`* |
| **`GET`**    | `/cars/count`  | **COUNT**        | Get count of cars in database | *`Number`* |
| **`POST`**   | `/cars`        | **CREATE_ONE**   | Create new car | *`Car`* |
| **`PUT`**    | `/cars/1`      | **UPDATE_ONE**   | Update a car with id 1 | *`Car`* |
| **`DELETE`** | `/cars/1`      | **DELETE_ONE**   | Delete a car with id 1 |  |
| **`POST`**   | `/cars/bulk`   | **CREATE_MANY**  | Create many cars |  |
| **`PUT`**    | `/cars/bulk`   | **UPDATE_MANY**  | Update many cars (all by default) |  |
| **`DELETE`** | `/cars/bulk`   | **DELETE_MANY**  | Delete many cars (all by default) |  |

## Make some queries

Neatsio comes with queries handler built-in on each generated endpoints. Queries work on **`GET_MANY`**, **`COUNT`**, **`UPDATE_MANY`** and **`DELETE_MANY`**. Use them like below :

```javascript
const qs = require('query-string')

const query = {
  // Only select 2 fields: lastname & firstname
  $select: 'lastname firstname',

  // Sort by lastname DESC
  $sort: '-lastname',

  // Limit the result to 10 entries
  $limit: 10,

  // Set offset of 50 entries before return
  $skip: 50,

  // Populate manager field with relation defined in the model
  $populate: 'manager',

  // Apply conditions (can use complex conditions)
  $conditions: { 
    $or: [
      {
        email: {
          $contains: '@acme.com'
        }
      },
      {
        active: true
      }
    ]
  }
}

const results = await axios
  .get(`http://localhost:3000/users${qs.stringify(query)}`)
  .then(response => response.data)
```
