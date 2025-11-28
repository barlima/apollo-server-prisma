import { beforeAll, describe, expect, it } from "vitest";
import { pick } from "./pick";

describe("pick", () => {
  let obj: Record<string, number | string | Record<string, string>>;

  beforeAll(() => {
    obj = {
      firstName: "Ricky",
      lastName: "LaFleur",
      age: 40,
      address: {
        street: "123 Main St",
        city: "Sunnyvale",
        state: "CA",
        zipCode: "94086",
      },
    } as const;
  });

  it("should pick only requested keys", () => {
    const actual = pick(obj, ["age"]);

    expect(actual.age).toBe(40);
    expect(Object.keys(actual).length).toBe(1);
  });

  it("should pick only requested keys with object value", () => {
    const actual = pick(obj, ["address"]);

    expect(actual.address).toEqual({
      street: "123 Main St",
      city: "Sunnyvale",
      state: "CA",
      zipCode: "94086",
    });
    expect(Object.keys(actual).length).toBe(1);
  });
});
