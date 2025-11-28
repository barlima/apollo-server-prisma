import { VerifyObject } from "../types/VerifyObject";

export const isObject = <T>(value: T): value is VerifyObject<T> =>
  !!value && typeof value === "object" && !Array.isArray(value);
