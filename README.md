#An example of a REST API in node.js

The aim of this example is to present an idea of how to structure a node.js app based on [express.js](https://github.com/expressjs/express) framework in order to serve an imaginary REST API.

## Used technologies

There are several used packages but the most important are:

1. [massive.js](https://github.com/dmfay/massive-js) A data mapper for Node.js and PostgreSQL.

2. [db-migrate](https://github.com/db-migrate/node-db-migrate) Database migration framework for node.

3. [passport](https://github.com/jaredhanson/passport) Simple, unobtrusive authentication for Node.js

4. [superstruct](https://github.com/ianstormtaylor/superstruct) A simple and composable way to validate data in Javascript.

5. [jest](https://github.com/facebook/jest) Delightful JavaScript Testing.

## Application architecture

### Service/repository pattern

The code is decoupled into service and repository layers to have more robust project structure. The controllers (route handlers) are trimmed down and the main business logic is focused at service layer. In this architecture repository layer communicates with data source and returns a define response.

### No models, no ORM

Beacuse the project is using [massive.js](https://github.com/dmfay/massive-js), data mapper for Node.js and PostgreSQL, there was no need to introduce a concept of models to describe data objects and its relationships. The reason for using `massive.js` derived from my past exepriences with ORMs. I found them as an attempt to reimplement SQL in their target language, which requires from a developer to learn abstract syntaxes without knowing what DB queries the syntaxes are actually producing.

Therefore I prefer using plain SQL for describing what data the app needs, especially when the required data is stored in two or more tables.

### Validating data objects

For validating data object shape, the project is using [superstruct](https://github.com/ianstormtaylor/superstruct), because of its expressive way for defining schema. The validation is done at runtime throwing errors with detailed descriptions. An example:

```
const validator = struct({
    username: "string",
    password: "string"
});
validator(input);
// Error is thrown from validator itself.
```

### Error handling

All errors are caught in error middleware. If an error occurs while performing some asynchronous operation (like DB query), then this error is also passed to the error middleware by ES7 async/await error handling.

An error is then tranfromed to a JSON response with an adequate status code (400, 401, 422, 500) following with internal error code number and message:

```
{
    "code": 3000,
    "message": "No user found."
}
```

## Installation

Edit postgreSQL connection data in `config/database.json` and then run:

```
npm install
npm run dev
```

All API endpoints are covered with several tests. To run tests:

```
npm run test
```

## API

The server speaks [JSON](https://en.wikipedia.org/wiki/JSON). Each request should include a `ContentType` header set to `application/json; charset=utf-8;`.

Each request made to private endpoint should include a `Authorization` header set to `JWT ${token}`. The token is returned after successful login in a response body.

Query requests through `GET` method can return status codes `200`, `400`, `401`, or `500`. Mutations through `POST`, `PUT` and `DELETE` can return also codes `201` and `422`. Invalid routes return status code `404`.

* **200**: Success.
* **201**: Successfully created.
* **400**: Invalid resource or resource not found.
* **401**: Unauthorized access.
* **422**: Data validation failed.
* **500**: System error.

## Endpoints

### [public] POST /signup

> Sign up to the system.

#### Body fields

| Name     | Type   | Required | Description      |
| -------- | ------ | -------- | ---------------- |
| username | String | true     | User's username. |
| password | String | true     | User's password. |

### [public] POST /login

> Logs ​in ​an ​existing ​user .

#### Body fields

| Name     | Type   | Required | Description      |
| -------- | ------ | -------- | ---------------- |
| username | String | true     | User's username. |
| password | String | true     | User's password. |

### [private] GET /me

> Get ​the ​currently ​logged ​in ​user ​information.

### [private] POST /me/update-password

> Update ​the ​current ​users ​password.

#### Body fields

| Name     | Type   | Required | Description   |
| -------- | ------ | -------- | ------------- |
| password | String | true     | New password. |

### [public] GET /user/:id/

> List ​username ​& ​number ​of ​likes ​of ​a ​user.

#### Path parameters

| Name | Type   | Description |
| ---- | ------ | ----------- |
| id   | Number | User ID.    |

### [private] POST /user/:id/like

> Like a user.

#### Path parameters

| Name | Type   | Description                    |
| ---- | ------ | ------------------------------ |
| id   | Number | User ID of a user to be liked. |

### [private] POST /user/:id/unlike

> Unlike a user.

#### Path parameters

| Name | Type   | Description                      |
| ---- | ------ | -------------------------------- |
| id   | Number | User ID of a user to be unliked. |

### [public] GET /most-liked

> Get a paginated list ​of users ​ordered from ​a ​most ​liked ​to ​least ​liked.
