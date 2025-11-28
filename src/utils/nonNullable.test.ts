import { describe, it, expect } from "vitest";
import { nonNullable } from "./nonNullable";

describe("nonNullable", () => {
  it("should return undefined when value is null", () => {
    expect(nonNullable(null)).toBeUndefined();
  });

  it("should return undefined when value is undefined", () => {
    expect(nonNullable(undefined)).toBeUndefined();
  });

  it("should return the value when it is a string", () => {
    expect(nonNullable("test")).toBe("test");
  });

  it("should return the value when it is a number", () => {
    expect(nonNullable(42)).toBe(42);
  });

  it("should return the value when it is zero", () => {
    expect(nonNullable(0)).toBe(0);
  });

  it("should return the value when it is an empty string", () => {
    expect(nonNullable("")).toBe("");
  });

  it("should return the value when it is false", () => {
    expect(nonNullable(false)).toBe(false);
  });

  it("should return the value when it is an object", () => {
    const obj = { key: "value" };
    expect(nonNullable(obj)).toBe(obj);
  });

  it("should return the value when it is an array", () => {
    const arr = [1, 2, 3];
    expect(nonNullable(arr)).toBe(arr);
  });
});
