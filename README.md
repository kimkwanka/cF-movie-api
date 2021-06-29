## cF-movie-api
A simple RESTful movie API that will serve as the backend of a future React app.

## Built With
- MongoDB
- Express
- Node.js

## Live Demo
[Live Demo on Heroku](https://dry-sands-45830.herokuapp.com/)

## Unique Features
This REST API is structured by components following the [Node.js Best Practices Project](https://github.com/goldbergyoni/nodebestpractices) and tries to separate the concerns of the different logic layers as much as possible as outlined in [this article](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way)  by Corey Cleary.

Furthermore ``async / await`` is instead of regular callbacks wherever possible to provide a cleaner and more readable code base.

## Getting started

### Install
After cloning the repository run either
``yarn`` or ``npm install`` to install all dependencies.

### Environment Variables
The API depends on the environment variables ``MONGODB_URI`` ([MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)) and ``JWT_SECRET`` ([JSON Web Token secret](https://jwt.io/introduction)) that need to be provided natively or via a ``.env`` in the project root.

Optionally, the ``PORT`` variable can be set to change the server's port (default: 8080).

### Usage
Use ``yarn start`` or ``npm start`` to run the API server.