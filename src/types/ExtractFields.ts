export type ExtractFields<
  TObject,
  TPrefix extends string
> = TObject extends Record<infer U, unknown>
  ? U extends `${TPrefix}${infer K}`
    ? K
    : never
  : never;
