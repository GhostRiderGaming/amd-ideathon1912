import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getDailyInsight } from '@/lib/gemini';
import { calculateDailyTotals, calculateHealthScore, calculateStreak } from '@/lib/nutrition';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayMeals = await prisma.meal.findMany({
      where: { userId, loggedAt: { gte: today, lte: todayEnd } },
      include: { items: true },
      orderBy: { loggedAt: 'desc' },
    });

    const allMeals = await prisma.meal.findMany({
      where: { userId },
      orderBy: { loggedAt: 'desc' },
    });

    const totals = calculateDailyTotals(todayMeals);
    const healthScore = calculateHealthScore(totals, user);
    const streak = calculateStreak(allMeals);

    const userContext = {
      name: user.name,
      goal: user.goal,
      targets: {
        calories: user.dailyCalorieTarget,
        protein: user.dailyProteinTarget,
        carbs: user.dailyCarbTarget,
        fat: user.dailyFatTarget,
      },
      todayIntake: totals,
      todayMealCount: todayMeals.length,
      currentTime: new Date().toLocaleTimeString(),
    };

    let insight = '';
    try {
      if (todayMeals.length > 0) {
        insight = await getDailyInsight(userContext);
      } else {
        insight = `Good ${getTimeOfDay()}! Start logging your meals to get personalized insights. 🍽️`;
      }
    } catch {
      insight = 'Log your meals to get personalized AI insights!';
    }

    return NextResponse.json({
      user,
      todayMeals,
      totals,
      healthScore,
      streak,
      insight,
      targets: {
        calories: user.dailyCalorieTarget,
        protein: user.dailyProteinTarget,
        carbs: user.dailyCarbTarget,
        fat: user.dailyFatTarget,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
