## flix-backend
REST-API and GraphQL server for the [RESTFlix](https://github.com/kimkwanka/RESTFlix) and  [GraphFlix](https://github.com/kimkwanka/GraphFlix) apps.

Movie data is provided via [TMDb API](https://developers.themoviedb.org/3/getting-started/introduction) and can be retrieved via REST proxy (endpoint `/tmdb`) or a GraphQL wrapper (endpoint `/graphql`).

In the same vein, User Management (CRUD) functionality can also be accessed via the corresponding REST endpoints or GraphQL operations.

[GraphQL Code Generator](https://www.graphql-code-generator.com/) is used to generate the base [TypeScript typings](https://www.graphql-code-generator.com/plugins/typescript) and [GraphQL resolver type signatures](https://www.graphql-code-generator.com/plugins/typescript-resolvers) directly from flix-backend's GraphQL schema.

For more information, check the [API documentation](https://movie-api.cardinalzero.com/documentation.html).
## Built With
- MongoDB / Mongoose
- Express
- Node.js
- GraphQL
- Apollo Server
- Redis
- TypeScript

## Live Version
You can find the live version at https://movie-api.cardinalzero.com/.

## Project Structure
This project is structured 'by components' following the [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) and tries to separate the concerns of the different logic layers as much as possible as outlined in [this article](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way) by Corey Cleary.

Each feature/component has its own folder containing at least a router, controller and a service file representing the different logic layers:

### HTTP Logic Layer
#### Router
The router only contains the routes and applies the corresponding
controller middleware - it does not contain any more logic than that.

#### Controller
The controller is responsible for handling the request by utilizing the appropriate services.

### Business Logic Layer

#### Service
The service contains the majority of the business logic and encapsulates
calls to the data access layer / models or external APIs.

### Data Access Layer / Models
This layer contains the logic for accessing persistent data (database, Redis server, etc.) - either directly or via an ORM / ODM Model.

## Authentication / Authorization

Authentication and authorization is realized using [JWTs](https://jwt.io/) and refresh token rotation with silent refresh. As the refresh tokens are provided as http-only, secure cookies it is imperative that the backend uses an encrypted HTTPS connection in production or the cookies can't be set by the server and therefore, auth won't be persistent. This is not an issue in development as most browsers ignore the "secure" setting from "localhost" and cookies can be set regardless.

## Getting Started

### Install
After cloning the repository run either
``yarn`` or ``npm install`` to install all dependencies.

### Environment Variables
The API depends on the following environment variables:

``MONGODB_URI`` ([MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/))

``JWT_SECRET`` ([JSON Web Token secret](https://jwt.io/introduction))

``TMDB_API_TOKEN`` ([TMDB API key](https://developers.themoviedb.org/3/getting-started/introduction))

``REDIS_HOST`` ([Redis server host name or ip](https://redis.io/topics/rediscli))

``REDIS_PORT`` ([Redis server port](https://redis.io/topics/rediscli))

``REDIS_PASS`` ([Redis server password](https://redis.io/topics/rediscli))

These need to be provided natively in your OS or via a ``.env`` in the project root.

Optionally, the ``PORT`` variable can be set to change the server's port (default: 8080).

### Usage
Use ``yarn start`` or ``npm start`` to run the API server.

