import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { builder } from "./lib/builder";
import { createContext } from "./context";
import { config } from "./config";
import "./graphql";

const schema = builder.toSchema();

const server = new ApolloServer({
  schema,
});

const { url } = await startStandaloneServer(server, {
  context: createContext,
  listen: { port: config.port },
});

console.log(`🚀  Server ready at: ${url}`);
