export type VerifyObject<T> = T extends Record<string, unknown> ? T : never;
