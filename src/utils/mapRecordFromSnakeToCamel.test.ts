import { describe, it, expect } from "vitest";
import { mapRecordFromSnakeToCamel } from "./mapRecordFromSnakeToCamel";

describe("mapRecordFromSnakeToCamel", () => {
  it("should map snake case object to camel case object", () => {
    const snakeCase = {
      user_id: 1,
      first_name: "Ricky",
      last_name: "Lafleur",
    };

    const actual = mapRecordFromSnakeToCamel(snakeCase);

    expect(actual.userId).toBe(1);
    expect(actual.firstName).toBe("Ricky");
    expect(actual.lastName).toBe("Lafleur");
  });

  it("should remove snake case keys from the object", () => {
    const snakeCase = {
      user_id: 1,
      first_name: "Ricky",
    };

    const actual = mapRecordFromSnakeToCamel(snakeCase) as Record<
      string,
      unknown
    >;
    expect(actual["user_id"]).toBeUndefined();
    expect(actual["first_name"]).toBeUndefined();
  });

  it("should keep camel case keys", () => {
    const snakeCase = {
      user_id: 1,
      first_name: "Ricky",
      lastName: "Lafleur",
      city: "Sunnyvale",
    };

    const actual = mapRecordFromSnakeToCamel(snakeCase);

    expect(Object.keys(actual).length).toBe(4);
    expect(actual.lastName).toBe("Lafleur");
    expect(actual.city).toBe("Sunnyvale");
  });

  it("should handle nested objects", () => {
    const snakeCase = {
      first_key: {
        nested_key: 10,
      },
      second_key: {
        nested_key: {
          nested_even_more: 20,
        },
      },
    };

    const actual = mapRecordFromSnakeToCamel(snakeCase);

    expect(actual.firstKey.nestedKey).toBe(10);
    expect(actual.secondKey.nestedKey.nestedEvenMore).toBe(20);
  });

  it("should handle nested arrays", () => {
    const snakeCase = {
      first_key: [
        {
          item_one: [1, 2, 3],
          item_two: { nested_item: [{ nested_array_key: 12 }] },
        },
      ],
    };

    const actual = mapRecordFromSnakeToCamel(snakeCase);

    expect(actual.firstKey[0].itemOne.length).toBe(3);
    expect(actual.firstKey[0].itemTwo.nestedItem[0].nestedArrayKey).toBe(12);
  });

  it("should handle null values", () => {
    const snakeCase = {
      first_key: {
        second_key: null,
      },
    };

    const actual = mapRecordFromSnakeToCamel(snakeCase);

    expect(actual.firstKey.secondKey).toBeNull();
  });

  it("should handle various values", () => {
    const snakeCase = {
      first_key: {
        null_key: null,
        undefined_key: undefined,
        empty_array_key: [],
        empty_object_key: {},
        zero_key: 0,
        empty_string_key: "",
      },
    };

    const actual = mapRecordFromSnakeToCamel(snakeCase);

    expect(actual.firstKey.nullKey).toBeNull();
    expect(actual.firstKey.undefinedKey).toBe(undefined);
    expect(actual.firstKey.emptyArrayKey).toBeTruthy();
    expect(actual.firstKey.emptyObjectKey).toBeTruthy();
    expect(actual.firstKey.zeroKey).toBe(0);
    expect(actual.firstKey.emptyStringKey).toBe("");
  });
});
