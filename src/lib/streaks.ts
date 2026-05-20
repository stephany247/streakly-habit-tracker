export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  const currentDate = today ?? new Date().toISOString().split("T")[0];

  const uniqueDates = [...new Set(completions)].sort();

  if (!uniqueDates.includes(currentDate)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(currentDate);

  while (true) {
    const formattedDate = checkDate.toISOString().split("T")[0];

    if (!uniqueDates.includes(formattedDate)) {
      break;
    }

    streak++;

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
