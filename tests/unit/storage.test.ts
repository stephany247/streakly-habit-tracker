import { describe, it, expect, beforeEach } from "vitest";

import { getStorageItem, setStorageItem } from "../../src/lib/storage";

describe("storage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and retrieves data", () => {
    setStorageItem("test-key", {
      name: "Drink Water",
    });

    const result = getStorageItem("test-key", null);

    expect(result).toEqual({
      name: "Drink Water",
    });
  });

  it("returns fallback value when storage key does not exist", () => {
    const result = getStorageItem("missing", []);

    expect(result).toEqual([]);
  });

  it("returns fallback when stored JSON is invalid", () => {
    localStorage.setItem("bad-json", "{invalid");

    const result = getStorageItem("bad-json", []);

    expect(result).toEqual([]);
  });

  it("returns fallback when window is undefined", () => {
    const originalWindow = global.window;

    // @ts-expect-error
    delete global.window;

    const result = getStorageItem("test", []);

    expect(result).toEqual([]);

    global.window = originalWindow;
  });
});
