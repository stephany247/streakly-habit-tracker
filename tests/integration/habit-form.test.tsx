import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockHabits: Record<string, unknown[]> = { data: [] };
vi.mock("../../src/lib/auth", () => ({
  getSession: () => ({ userId: "u1", email: "test@test.com" }),
  clearSession: vi.fn(),
  getHabits: () => mockHabits.data,
  saveHabits: (h: unknown[]) => {
    mockHabits.data = h;
  },
  getUsers: () => [],
  saveUsers: vi.fn(),
  saveSession: vi.fn(),
}));

import HabitForm from "../../src/components/habits/HabitForm";

describe("habit form", () => {
  beforeEach(() => {
    mockHabits.data = [];
  });

  it("shows a validation error when habit name is empty", async () => {
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByTestId("habit-save-button"));
    await waitFor(() => {
      expect(screen.getByText("Habit name is required")).toBeInTheDocument();
    });
    expect(onSave).not.toHaveBeenCalled();
  });

  it("creates a new habit and renders it in the list", async () => {
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Drink Water" }),
      );
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const habit = {
      id: "h1",
      userId: "u1",
      name: "Run",
      description: "",
      frequency: "daily" as const,
      createdAt: "2024-01-01T00:00:00Z",
      completions: ["2024-01-05"],
    };
    const onSave = vi.fn();
    render(<HabitForm habit={habit} onSave={onSave} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Run Fast" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "h1",
          userId: "u1",
          createdAt: "2024-01-01T00:00:00Z",
          completions: ["2024-01-05"],
          name: "Run Fast",
        }),
      );
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const { default: HabitCard } =
      await import("../../src/components/habits/HabitCard");
    const habit = {
      id: "h1",
      userId: "u1",
      name: "Meditate",
      description: "",
      frequency: "daily" as const,
      createdAt: "",
      completions: [],
    };
    const onDelete = vi.fn();
    render(
      <HabitCard
        habit={habit}
        today="2024-01-10"
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByTestId("habit-delete-meditate"));
    expect(screen.getByTestId("confirm-delete-button")).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("confirm-delete-button"));
    expect(onDelete).toHaveBeenCalledWith("h1");
  });

  it("toggles completion and updates the streak display", async () => {
    const { default: HabitCard } =
      await import("../../src/components/habits/HabitCard");
    const today = "2024-01-10";
    const habit = {
      id: "h1",
      userId: "u1",
      name: "Yoga",
      description: "",
      frequency: "daily" as const,
      createdAt: "",
      completions: [today],
    };
    render(
      <HabitCard
        habit={habit}
        today={today}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByTestId("habit-streak-yoga").textContent).toContain(
      "1 day streak",
    );
  });
});
