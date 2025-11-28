import { describe, it, expect } from "vitest";
import { fromParent } from "./fromParent";

describe("fromParent", () => {
  it("should return the value from the parent", () => {
    const parent = {
      name: "John",
    };
    const value = fromParent("name")(parent);
    expect(value).toBe("John");
  });

  it("should return undefined if the field is not found", () => {
    const parent = {};
    const value = fromParent("name")(parent);
    expect(value).toBeUndefined();
  });

  it("should return the value from the parent with a prefix", () => {
    const parent = {
      address: {
        street: "123 Main St",
      },
    };
    const value = fromParent("address")(parent);
    expect(typeof value).toBe("object");
    expect(value).toEqual({ street: "123 Main St" });
  });
});
