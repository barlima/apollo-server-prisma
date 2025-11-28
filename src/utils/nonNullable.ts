export const nonNullable = <T>(value?: T): NonNullable<T> | undefined => {
  if (value === null) {
    return;
  }

  return value;
};
