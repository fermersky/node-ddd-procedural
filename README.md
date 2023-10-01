# Node.js server with minimalistic implementation of DDD

This is a Node.js server that implements Domain-Driven Design (DDD) in a minimalistic way. The main purpose of this server is to focus on business logic and be agnostic to any transport or protocol.

The server has two entities, namely Driver and WorkShift. A driver can have multiple shifts. Instead of using an ORM, the server uses manual mapping from SQL queries to domain entities. The server implements dependency injection using ESM and function parameters. However, using `tsyringe/inversify` libraries would be a better option as it would remove the responsibility of instantiating dependencies from the app code.

The server supports two different transports: HTTP (fastify) and WebSocket (uWebSocket.js).

The documentation is generated using Docusaurus, and can be found in the `drivers-app-docs` folder.
