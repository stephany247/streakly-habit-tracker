"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Habit } from "@/types/habit";
import { getSession, clearSession, getHabits, saveHabits } from "@/lib/auth";
import { toggleHabitCompletion } from "@/lib/habits";
import HabitForm from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { MdCheck } from "react-icons/md";
import { LuClock3, LuLogOut } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const session = getSession();
    if (!session) return;

    setUserEmail(session.email);
    setUserId(session.userId);
    const allHabits = getHabits();
    setHabits(allHabits.filter((h) => h.userId === session.userId));
  }, [router]);

  const handleSaveHabit = (data: {
    name: string;
    description: string;
    frequency: "daily";
  }) => {
    const allHabits = getHabits();

    if (editingHabit) {
      const updated = allHabits.map((h) =>
        h.id === editingHabit.id
          ? { ...editingHabit, name: data.name, description: data.description }
          : h,
      );
      saveHabits(updated);
      setHabits(updated.filter((h) => h.userId === userId));
      setEditingHabit(null);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId,
        name: data.name,
        description: data.description,
        frequency: "daily",
        createdAt: new Date().toISOString(),
        completions: [],
      };
      const updated = [...allHabits, newHabit];
      saveHabits(updated);
      setHabits(updated.filter((h) => h.userId === userId));
    }
    setShowForm(false);
  };

  const handleToggle = (habitId: string) => {
    const allHabits = getHabits();
    const updated = allHabits.map((h) =>
      h.id === habitId ? toggleHabitCompletion(h, today) : h,
    );
    saveHabits(updated);
    setHabits(updated.filter((h) => h.userId === userId));
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDelete = (habitId: string) => {
    const allHabits = getHabits();
    const updated = allHabits.filter((h) => h.id !== habitId);
    saveHabits(updated);
    setHabits(updated.filter((h) => h.userId === userId));
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const completedToday = habits.filter((h) =>
    h.completions.includes(today),
  ).length;

  return (
    <ProtectedRoute>
      <div
        data-testid="dashboard-page"
        className="min-h-screen bg-black text-white"
      >
        {/* Header */}
        <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-zinc-900 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-orange-500 text-2xl text-white flex items-center justify-center">
                <MdCheck />
              </div>
              <h1 className="font-bebas text-2xl font-black tracking-tight text-white uppercase">
                Streakly
              </h1>
            </div>
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors duration-200 ease-in-out flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <LuLogOut size={20} />
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
          {/* Stats bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <p className="text-zinc-400 text-xs mb-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-white font-bold text-lg">
              {habits.length === 0
                ? "No habits yet"
                : completedToday === habits.length
                  ? "🔥 All done for today!"
                  : `${completedToday} of ${habits.length} complete`}
            </p>
            {habits.length > 0 && (
              <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${habits.length ? (completedToday / habits.length) * 100 : 0}%`,
                  }}
                />
              </div>
            )}
          </div>

          {habits.length > 0 && !showForm && (
            <div className="flex items-center justify-between mt-8">
              <h2 className="text-xl font-bold text-white tracking-tight">
              Your habits
              </h2>
              <button
                data-testid="create-habit-button"
                onClick={() => setShowForm(true)}
                className="max-w-sm flex items-center justify-center gap-2 text-orange-500 hover:text-orange-400 active:scale-[0.99] font-bold py-3.5 rounded-2xl transition-all text-sm cursor-pointer"
              >
                <FaPlus size={14} />
                New
              </button>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <HabitForm
              habit={editingHabit || undefined}
              onSave={handleSaveHabit}
              onCancel={() => {
                setShowForm(false);
                setEditingHabit(null);
              }}
            />
          )}

          {/* Habits list */}
          {habits.length === 0 && !showForm ? (
            <div
              data-testid="empty-state"
              className="py-20 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/40 text-orange-500 flex items-center justify-center shadow-inner">
                <LuClock3 size={36} />
              </div>

              <div className="mt-6 space-y-2 max-w-sm">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  No habits yet
                </h2>

                <p className="text-zinc-500 text-sm leading-relaxed">
                  Start building consistency by creating your first habit and
                  tracking your daily progress.
                </p>
              </div>

              <button
                data-testid="create-habit-button"
                onClick={() => setShowForm(true)}
                className="mt-8 w-full max-w-sm flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl transition-all text-sm shadow-[0_10px_30px_rgba(249,115,22,0.25)]"
              >
                <FaPlus size={14} />
                Create Your First Habit
              </button>
            </div>
          ) : (
            <HabitList
              habits={habits}
              today={today}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
