export interface ICache<T = Record<string, unknown>> {
  get(key: string | number): T | null;
  set(key: string | number, data: T): void;
  clear(): void;
}
