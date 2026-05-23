import { describe, it, expect, beforeEach } from "vitest";

import {
  getUsers,
  saveUsers,
  saveSession,
  getSession,
  clearSession,
  getHabits,
  saveHabits,
} from "../../src/lib/auth";
import { Habit } from "@/types/habit";

describe("auth storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and retrieves users", () => {
    const users = [
      {
        id: "1",
        email: "test@test.com",
        password: "pass",
        createdAt: "",
      },
    ];

    saveUsers(users);

    expect(getUsers()).toEqual(users);
  });

  it("saves and retrieves session", () => {
    const session = {
      userId: "1",
      email: "test@test.com",
    };

    saveSession(session);

    expect(getSession()).toEqual(session);
  });

  it("clears session", () => {
    saveSession({
      userId: "1",
      email: "test@test.com",
    });

    clearSession();

    expect(getSession()).toBeNull();
  });

  it("saves and retrieves habits", () => {
    const habits: Habit[] = [
      {
        id: "1",
        userId: "u1",
        name: "Drink Water",
        description: "",
        frequency: "daily",
        createdAt: "",
        completions: [],
      },
    ];

    saveHabits(habits);

    expect(getHabits()).toEqual(habits);
  });
});
