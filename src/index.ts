import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';

import context from './context';
import schema from './schema';

const app = express();

const server = new ApolloServer({ schema, context });

server.applyMiddleware({ app, path: '/' });

createConnection()
  .then(() => {
    app.listen({ port: process.env.PORT }, () => {
      // eslint-disable-next-line no-console
      console.log(
        `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`,
      );
    });
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
