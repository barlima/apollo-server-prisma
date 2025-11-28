import { describe, it, expect } from "vitest";
import { isObject } from "./isObject";

describe("isObject", () => {
  it("should return true when the value is an object", () => {
    expect(isObject({ name: "John" })).toBe(true);
  });

  it("should return false when the value is an array", () => {
    expect(isObject([])).toBe(false);
  });

  it("should return false when the value is a string", () => {
    expect(isObject("test")).toBe(false);
  });

  it("should return false when the value is a number", () => {
    expect(isObject(42)).toBe(false);
  });

  it("should return false when the value is a boolean", () => {
    expect(isObject(true)).toBe(false);
  });

  it("should return false when the value is a null", () => {
    expect(isObject(null)).toBe(false);
  });

  it("should return false when the value is a undefined", () => {
    expect(isObject(undefined)).toBe(false);
  });

  it("should return false when the value is a function", () => {
    expect(isObject(() => {})).toBe(false);
  });

  it("should return false when the value is a symbol", () => {
    expect(isObject(Symbol())).toBe(false);
  });
});
