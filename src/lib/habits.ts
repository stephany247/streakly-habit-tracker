import { Habit } from '@/types/habit';

export function toggleHabitCompletion(
  habit: Habit,
  date: string
): Habit {
  const exists = habit.completions.includes(date);

  let completions = exists
    ? habit.completions.filter((d) => d !== date)
    : [...habit.completions, date];

  completions = [...new Set(completions)];

  return {
    ...habit,
    completions,
  };
}