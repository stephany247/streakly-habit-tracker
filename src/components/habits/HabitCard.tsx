"use client";

import { useState } from "react";
import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdCheck } from "react-icons/md";
import { IoFlame, IoFlameOutline } from "react-icons/io5";

interface HabitCardProps {
  habit: Habit;
  today: string;
  onToggle: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitCard({
  habit,
  today,
  onToggle,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const isCompleted = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        isCompleted
          ? "bg-orange-500/10 border-orange-500/40"
          : "bg-zinc-900 border-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-bold text-base truncate ${isCompleted ? "text-white" : "text-white"}`}
            >
              {habit.name}
            </h3>
            {isCompleted && (
              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full font-medium shrink-0">
                Done
              </span>
            )}
          </div>
          {habit.description && (
            <p className="text-zinc-400 text-xs truncate">
              {habit.description}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-2">
            {streak > 0 ? (
              <IoFlame size={14} className="text-orange-500 shrink-0" />
            ) : (
              <IoFlameOutline size={14} className="text-zinc-500 shrink-0" />
            )}

            <span
              data-testid={`habit-streak-${slug}`}
              className={`text-xs font-semibold ${
                streak > 0 ? "text-orange-500" : "text-zinc-500"
              }`}
            >
              {streak} day streak
            </span>
          </div>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit.id)}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
            isCompleted
              ? "bg-orange-500 border-orange-500 text-white text-2xl"
              : "bg-transparent border-zinc-700 text-transparent hover:border-orange-500"
          }`}
          aria-label={
            isCompleted ? `Unmark ${habit.name}` : `Mark ${habit.name} complete`
          }
        >
          <MdCheck />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-700">
        {!confirmDelete ? (
          <>
            <button
              data-testid={`habit-edit-${slug}`}
              onClick={() => onEdit(habit)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-300 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              <FiEdit />
              Edit
            </button>
            <button
              data-testid={`habit-delete-${slug}`}
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10 cursor-pointer"
            >
              <FaRegTrashAlt />
              Delete
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-zinc-400 flex-1">
              Delete this habit?
            </span>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
