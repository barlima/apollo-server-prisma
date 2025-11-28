export const fromParent =
  <T extends Record<string, unknown>, K extends keyof T>(field: K) =>
  (parent: T) =>
    parent[field] as T[K];
