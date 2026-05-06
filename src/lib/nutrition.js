export function calculateDailyTotals(meals) {
  return meals.reduce(
    (t, m) => ({
      calories: t.calories + (m.calories || 0),
      protein: t.protein + (m.protein || 0),
      carbs: t.carbs + (m.carbs || 0),
      fat: t.fat + (m.fat || 0),
      fiber: t.fiber + (m.fiber || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

export function calculateHealthScore(totals, targets) {
  const calRatio = targets.dailyCalorieTarget
    ? totals.calories / targets.dailyCalorieTarget
    : 0;
  const calScore = Math.max(0, 100 - Math.abs(1 - calRatio) * 200);

  const proteinRatio = targets.dailyProteinTarget
    ? Math.min(totals.protein / targets.dailyProteinTarget, 1.2)
    : 0;
  const proteinScore = proteinRatio * 83;

  const fiberScore = Math.min((totals.fiber / 25) * 100, 100);

  const avg = (calScore + proteinScore + fiberScore) / 3;
  return Math.round(Math.min(Math.max(avg, 0), 100));
}

export function calculateStreak(meals) {
  if (!meals.length) return 0;
  const dayKeys = [...new Set(meals.map(m => {
    const d = new Date(m.loggedAt || m.createdAt);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }))];

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (dayKeys.includes(key)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getMealTypeByTime() {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 18) return 'snack';
  return 'dinner';
}

export function formatMacro(value) {
  return Math.round((value || 0) * 10) / 10;
}

export function getPercentage(current, target) {
  if (!target) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}
