import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import context from './context';
import schema from './schema';

const app = express();

const server = new ApolloServer({ schema, context });

server.applyMiddleware({ app, path: '/' });

app.listen({ port: process.env.PORT }, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`,
  );
});
