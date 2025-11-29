import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";

import express from "express";
import { createServer } from "http";

import { builder } from "./lib/builder";
import { createContext, type Context } from "./context";
import { config } from "./config";
import { prisma } from "./lib/prisma";
import "./graphql";

const schema = builder.toSchema();

const app = express();
const httpServer = createServer(app);

const server = new ApolloServer<Context>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors(), // For testing purposes only
  express.json(),
  expressMiddleware(server, {
    context: createContext,
  })
);

httpServer.listen(config.port, () => {
  console.log(`🚀  Server ready at: http://localhost:${config.port}/graphql`);
});

const shutdown = async () => {
  console.log("Shutting down...");
  await server.stop();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGTERM", () => void shutdown());
process.on("SIGINT", () => void shutdown());
