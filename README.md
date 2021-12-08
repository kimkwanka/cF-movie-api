## cf-movie-api
A simple RESTful movie API.

## Built With
- MongoDB
- Express
- Node.js

## Live Version
You can find the live version at https://movie-api.cardinalzero.com/.

## Project Structure
This REST API is structured by components following the [Node.js Best Practices Project](https://github.com/goldbergyoni/nodebestpractices) and tries to separate the concerns of the different logic layers as much as possible as outlined in [this article](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way) by Corey Cleary.

Each feature/component has its own folder containing at least a router, controller and a service file representing the different logic layers.

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

## Getting started

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
