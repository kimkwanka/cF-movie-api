## cf-movie-api
A simple RESTful movie API.

## Built With
- MongoDB
- Express
- Node.js

## Live Version
You can find the live version at https://movie-api.cardinalzero.com/.

## Unique Features
This REST API is structured by components following the [Node.js Best Practices Project](https://github.com/goldbergyoni/nodebestpractices) and tries to separate the concerns of the different logic layers as much as possible as outlined in [this article](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way)  by Corey Cleary.

Furthermore ``async / await`` is used instead of regular callbacks wherever possible to provide a cleaner and more readable code base.

## Getting started

### Install
After cloning the repository run either
``yarn`` or ``npm install`` to install all dependencies.

### Environment Variables
The API depends on the environment variables ``MONGODB_URI`` ([MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)) and ``JWT_SECRET`` ([JSON Web Token secret](https://jwt.io/introduction)) that need to be provided natively or via a ``.env`` in the project root.

Optionally, the ``PORT`` variable can be set to change the server's port (default: 8080).

### Usage
Use ``yarn start`` or ``npm start`` to run the API server.
