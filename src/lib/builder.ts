import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import RelayPlugin from "@pothos/plugin-relay";
import ZodPlugin from "@pothos/plugin-zod";

import type PrismaTypes from "../generated/pothos";
import { getDatamodel } from "../generated/pothos";
import { prisma } from "./prisma";
import type { Context } from "../context";
import { config } from "../config";
import { GraphQLError } from "graphql";

const builder = new SchemaBuilder<{
  Context: Context;
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin, ZodPlugin],
  relay: {
    clientMutationId: "omit",
    cursorType: "String",
  },
  zod: {
    validationError: (zodError) => {
      return new GraphQLError(zodError.message, {
        extensions: {
          code: "BAD_USER_INPUT",
          validationErrors: zodError.message,
        },
      });
    },
  },
  prisma: {
    client: prisma,
    // This give pothos information about your tables, relations, and indexes to help it generate optimal queries at runtime.
    // This used to be attached to the prisma client, but has been removed in most runtimes/modes to reduce bundle size.
    dmmf: getDatamodel(),
    // defaults to false, uses /// comments from prisma schema as descriptions
    // for object types, relations and exposed fields.
    // descriptions can be omitted by setting description to false
    exposeDescriptions: true,
    // use where clause from prismaRelatedConnection for totalCount (defaults to true)
    filterConnectionTotalCount: true,
    // warn when not using a query parameter correctly
    onUnusedQuery: config.isDevelopment ? "warn" : null,
  },
});

builder.queryType({});
builder.mutationType({});

export { builder };
