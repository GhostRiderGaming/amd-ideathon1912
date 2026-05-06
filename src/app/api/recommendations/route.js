import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getRecommendations } from '@/lib/gemini';
import { calculateDailyTotals } from '@/lib/nutrition';

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
    });

    const totals = calculateDailyTotals(todayMeals);

    const userContext = {
      name: user.name,
      goal: user.goal,
      restrictions: user.dietaryRestrictions,
      allergies: user.allergies,
      targets: {
        calories: user.dailyCalorieTarget,
        protein: user.dailyProteinTarget,
        carbs: user.dailyCarbTarget,
        fat: user.dailyFatTarget,
      },
      consumed: totals,
      remaining: {
        calories: user.dailyCalorieTarget - totals.calories,
        protein: user.dailyProteinTarget - totals.protein,
        carbs: user.dailyCarbTarget - totals.carbs,
        fat: user.dailyFatTarget - totals.fat,
      },
      todayMeals: todayMeals.map(m => m.name),
      currentTime: new Date().toLocaleTimeString(),
    };

    const recommendations = await getRecommendations(userContext);
    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
