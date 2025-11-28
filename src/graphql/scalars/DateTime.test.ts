import { describe, it, expect } from "vitest";
import { serialize, parseValue } from "./DateTime";

describe("DateTime scalar", () => {
  it("should serialize a Date object to an ISO string", () => {
    const date = new Date("2021-01-01T00:00:00.000Z");
    const result = serialize(date);
    expect(result).toBe("2021-01-01T00:00:00.000Z");
  });

  it("should parse an ISO string to a Date object", () => {
    const date = "2021-01-01T00:00:00.000Z";
    const result = parseValue(date);
    expect(result).toEqual(new Date(date));
  });

  it("should throw an error if the value is not a Date object", () => {
    expect(() => serialize("not a date")).toThrow(
      "DateTime must be a Date object"
    );
  });

  it("should throw an error if the value is not an ISO string", () => {
    expect(() => parseValue("not an ISO string")).toThrow(
      "DateTime must be an ISO string"
    );
  });
});
