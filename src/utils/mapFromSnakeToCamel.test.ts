import { describe, expect, it } from "vitest";
import { mapFromSnakeToCamel } from "./mapFromSnakeToCamel";

describe("mapFromSnakeToCamel", () => {
  it("should map snake case to camel case", () => {
    const actual = mapFromSnakeToCamel("snake_case_key");
    expect(actual).toBe("snakeCaseKey");
  });

  it("should not change simple strings", () => {
    const actual = mapFromSnakeToCamel("key");
    expect(actual).toBe("key");
  });

  it("should not change empty strings", () => {
    const actual = mapFromSnakeToCamel("");
    expect(actual).toBe("");
  });

  it("should not change special character", () => {
    const actual = mapFromSnakeToCamel(".+-#*");
    expect(actual).toBe(".+-#*");
  });
});
