import { ICache } from "./type";

export class SimpleCache<T = Record<string, unknown>> implements ICache<T> {
  private cache = new Map<string | number, { data: T; timestamp: number }>();
  private readonly ttl: number;

  constructor(ttlInMinutes: number = 5) {
    this.ttl = ttlInMinutes * 60 * 1000;
  }

  get(key: string | number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string | number, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}
