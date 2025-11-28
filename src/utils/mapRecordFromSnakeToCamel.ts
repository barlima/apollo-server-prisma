import { ObjectSnakeToCamel } from "../types/ObjectSnakeToCamel";
import { VerifyObject } from "../types/VerifyObject";

import { isObject } from "./isObject";
import { mapFromSnakeToCamel } from "./mapFromSnakeToCamel";

type ReturnValue<T> = ObjectSnakeToCamel<VerifyObject<T>> | T;

const mapValueFromSnakeToCamel = <T>(value: T): ReturnValue<T> => {
  if (isObject(value)) {
    return mapRecordFromSnakeToCamel(value);
  }

  return value;
};

export const mapRecordFromSnakeToCamel = <T extends Record<string, unknown>>(
  record: T
) =>
  Object.entries(record).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [mapFromSnakeToCamel(key)]: Array.isArray(value)
        ? value.map(mapValueFromSnakeToCamel)
        : mapValueFromSnakeToCamel(value),
    }),
    {} as ObjectSnakeToCamel<T>
  );
