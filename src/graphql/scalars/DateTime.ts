import { builder } from "../../lib/builder";

export const serialize = (value: unknown) => {
  if (!(value instanceof Date)) {
    throw new Error("DateTime must be a Date object");
  }
  return value.toISOString();
};

export const parseValue = (value: unknown) => {
  if (typeof value !== "string") {
    throw new Error("DateTime must be an ISO string");
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new Error("DateTime must be an ISO string");
  }

  return date;
};

builder.scalarType("DateTime", {
  serialize,
  parseValue,
});
