import { Habit } from '@/types/habit';
import HabitCard from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  today: string;
  onToggle: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

export default function HabitList({
  habits,
  today,
  onToggle,
  onEdit,
  onDelete,
}: HabitListProps) {
  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}