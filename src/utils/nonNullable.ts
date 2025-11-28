export const nonNullable = <T>(value?: T): NonNullable<T> | undefined =>
  value === null ? undefined : value;
