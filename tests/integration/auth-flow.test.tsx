import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "mock-uuid",
  },
});

// Mock next/navigation
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Mock storage with in-memory store
const store: Record<string, string> = {};
vi.mock("@/lib/auth", () => ({
  getUsers: () => JSON.parse(store["habit-tracker-users"] || "[]"),
  saveUsers: (u: unknown) => {
    store["habit-tracker-users"] = JSON.stringify(u);
  },
  getSession: () => JSON.parse(store["habit-tracker-session"] || "null"),
  saveSession: (s: unknown) => {
    store["habit-tracker-session"] = JSON.stringify(s);
  },
  clearSession: () => {
    store["habit-tracker-session"] = "null";
  },
  getHabits: () => [],
  saveHabits: vi.fn(),
}));

import SignupForm from "../../src/components/auth/SignupForm";
import LoginForm from "../../src/components/auth/LoginForm";

describe("auth flow", () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
  });

  it("submits the signup form and creates a session", async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));
    await waitFor(() => {
      const session = JSON.parse(store["habit-tracker-session"] || "null");
      expect(session?.email).toBe("test@test.com");
    });
  });

  it("shows an error for duplicate signup email", async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "dupe@test.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "pw" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));
    await waitFor(() => {});
    render(<SignupForm />);
    fireEvent.change(screen.getAllByTestId("auth-signup-email")[1], {
      target: { value: "dupe@test.com" },
    });
    fireEvent.change(screen.getAllByTestId("auth-signup-password")[1], {
      target: { value: "pw" },
    });
    fireEvent.click(screen.getAllByTestId("auth-signup-submit")[1]);
    await waitFor(() => {
      expect(screen.getByText("User already exists")).toBeInTheDocument();
    });
  });

  it("submits the login form and stores the active session", async () => {
    store["habit-tracker-users"] = JSON.stringify([
      { id: "u1", email: "login@test.com", password: "pass", createdAt: "" },
    ]);
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "login@test.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));
    await waitFor(() => {
      const session = JSON.parse(store["habit-tracker-session"] || "null");
      expect(session?.email).toBe("login@test.com");
    });
  });

  it("shows an error for invalid login credentials", async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));
    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });
});
