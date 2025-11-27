import { ApolloServerOptions, BaseContext } from "@apollo/server";

type Resolvers = ApolloServerOptions<BaseContext>["resolvers"];

export const resolvers: Resolvers = {
  Query: {
    hello: () => "Hello",
  },
};
