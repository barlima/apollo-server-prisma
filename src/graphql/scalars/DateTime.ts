import { builder } from "../../lib/builder";

builder.scalarType("DateTime", {
  serialize: (value: unknown) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error("DateTime must be a Date object");
  },
  parseValue: (value: unknown) => {
    if (value instanceof Date) {
      return value;
    }
    throw new Error("DateTime must be a Date object");
  },
});
