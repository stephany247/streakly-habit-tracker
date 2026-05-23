"use client";

import { useState } from "react";
import { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";
import { getSession } from "@/lib/auth";

interface HabitFormProps {
  habit?: Habit;
  onSave: (data: {
    name: string;
    description: string;
    frequency: "daily";
  }) => void;
  onCancel: () => void;
}

export default function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [frequency] = useState<"daily">("daily");
  const [nameError, setNameError] = useState("");
  const session = getSession();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateHabitName(name);

    if (!validation.valid) {
      setNameError(validation.error || "");
      return;
    }

    setNameError("");

    const updatedHabit = habit
      ? {
          ...habit,
          name: validation.value,
          description,
        }
      : {
          id: crypto.randomUUID(),
          userId: session?.userId || '',
          name: validation.value,
          description,
          frequency,
          createdAt: new Date().toISOString(),
          completions: [],
        };

    onSave(updatedHabit);
  };

  return (
    <div
      data-testid="habit-form"
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4"
    >
      <h3 className="text-white font-bold text-lg">
        {habit ? "Edit Habit" : "New Habit"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="habit-name"
            className="block text-sm font-medium text-zinc-200 mb-1.5"
          >
            Name <span className="text-orange-500">*</span>
          </label>
          <input
            id="habit-name"
            type="text"
            data-testid="habit-name-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-zinc-600"
            placeholder="e.g. Drink Water"
          />
          {nameError && (
            <p className="text-red-400 text-xs mt-1.5">{nameError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="habit-description"
            className="block text-sm font-medium text-zinc-200 mb-1.5"
          >
            Description
          </label>
          <input
            id="habit-description"
            type="text"
            data-testid="habit-description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-zinc-600"
            placeholder="Optional description"
          />
        </div>

        <div>
          <label
            htmlFor="habit-frequency"
            className="block text-sm font-medium text-zinc-200 mb-1.5"
          >
            Frequency
          </label>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value={frequency}
            disabled
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-3 rounded-xl transition-colors text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="habit-save-button"
            className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 rounded-xl transition-colors text-sm cursor-pointer"
          >
            {habit ? "Save Changes" : "Create Habit"}
          </button>
        </div>
      </form>
    </div>
  );
}
