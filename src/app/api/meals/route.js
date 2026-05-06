import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeMealText } from '@/lib/gemini';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const where = { userId };
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.loggedAt = { gte: start, lte: end };
    }

    const meals = await prisma.meal.findMany({
      where,
      include: { items: true },
      orderBy: { loggedAt: 'desc' },
    });
    return NextResponse.json(meals);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, description, mealType } = body;

    if (!userId || !description) {
      return NextResponse.json({ error: 'userId and description required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userContext = user ? {
      goal: user.goal,
      restrictions: user.dietaryRestrictions,
      allergies: user.allergies,
    } : {};

    const analysis = await analyzeMealText(description, userContext);

    const meal = await prisma.meal.create({
      data: {
        userId,
        name: analysis.name || description,
        description: analysis.description || description,
        mealType: mealType || analysis.mealType || 'snack',
        calories: analysis.totalCalories || 0,
        protein: analysis.totalProtein || 0,
        carbs: analysis.totalCarbs || 0,
        fat: analysis.totalFat || 0,
        fiber: analysis.totalFiber || 0,
        healthScore: analysis.healthScore || 50,
        aiAnalysis: JSON.stringify(analysis),
        aiSuggestions: analysis.suggestions || '',
        items: {
          create: (analysis.items || []).map(item => ({
            name: item.name,
            quantity: item.quantity || '',
            calories: item.calories || 0,
            protein: item.protein || 0,
            carbs: item.carbs || 0,
            fat: item.fat || 0,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
