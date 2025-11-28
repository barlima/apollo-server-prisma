export type SnakeToCamel<TKey extends string> =
  TKey extends `${infer U}_${infer V}`
    ? `${U}${Capitalize<SnakeToCamel<V>>}`
    : TKey;
