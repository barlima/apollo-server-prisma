export const pick = <
  TObj extends Record<string, unknown>,
  TKeys extends keyof TObj
>(
  obj: TObj,
  keys: TKeys[] | "*"
) => {
  if (keys === "*") {
    return obj;
  }

  return keys.reduce((acc, key) => {
    return {
      ...acc,
      [key]: obj[key],
    };
  }, {} as Pick<TObj, TKeys>);
};
