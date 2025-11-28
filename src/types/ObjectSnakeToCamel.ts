import { SnakeToCamel } from "./SnakeToCamel";

export type ObjectSnakeToCamel<TObject extends Record<string, unknown>> = {
  [TProperty in keyof TObject as SnakeToCamel<
    TProperty & string
  >]: TObject[TProperty] extends Array<infer TArrayItem>
    ? TArrayItem extends Record<string, unknown>
      ? Array<ObjectSnakeToCamel<TArrayItem>>
      : TObject[TProperty]
    : TObject[TProperty] extends Record<string, unknown>
    ? ObjectSnakeToCamel<TObject[TProperty]>
    : TObject[TProperty];
};
