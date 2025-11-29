import { describe, it, expect, beforeEach, vi } from "vitest";
import { SimpleCache } from "./simpleCache";

describe("SimpleCache", () => {
  let cache: SimpleCache<string>;

  beforeEach(() => {
    cache = new SimpleCache<string>(5);
  });

  describe("set", () => {
    it("should store data with a key", () => {
      cache.set("key1", "value1");
      const result = cache.get("key1");

      expect(result).toBe("value1");
    });

    it("should support numeric keys", () => {
      cache.set(12345, "numeric key value");
      const result = cache.get(12345);

      expect(result).toBe("numeric key value");
    });

    it("should overwrite existing data with the same key", () => {
      cache.set("key1", "first value");
      cache.set("key1", "second value");

      const result = cache.get("key1");

      expect(result).toBe("second value");
    });
  });

  describe("get", () => {
    it("should return data for a valid key", () => {
      cache.set("key1", "value1");

      const result = cache.get("key1");

      expect(result).toBe("value1");
    });

    it("should return null for a non-existent key", () => {
      const result = cache.get("nonexistent");

      expect(result).toBeNull();
    });

    it("should return null for expired data", () => {
      vi.useFakeTimers();

      cache.set("key1", "value1");

      // Add 6 minutes
      vi.advanceTimersByTime(6 * 60 * 1000);

      const result = cache.get("key1");

      expect(result).toBeNull();

      vi.useRealTimers();
    });

    it("should return data if not expired", () => {
      vi.useFakeTimers();

      cache.set("key1", "value1");

      // Add 3 minutes
      vi.advanceTimersByTime(3 * 60 * 1000);

      const result = cache.get("key1");

      expect(result).toBe("value1");

      vi.useRealTimers();
    });

    it("should delete expired data when accessed", () => {
      vi.useFakeTimers();

      cache.set("key1", "value1");

      // Add 6 minutes
      vi.advanceTimersByTime(6 * 60 * 1000);

      const result1 = cache.get("key1");
      expect(result1).toBeNull();

      vi.useRealTimers();
    });
  });

  describe("clear", () => {
    it("should remove all cached data", () => {
      cache.set("key1", "value1");
      cache.set("key2", "value2");
      cache.set(123, "value3");

      cache.clear();

      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBeNull();
      expect(cache.get(123)).toBeNull();
    });

    it("should allow setting data after clearing", () => {
      cache.set("key1", "value1");
      cache.clear();

      cache.set("key2", "value2");

      expect(cache.get("key2")).toBe("value2");
    });
  });
});
