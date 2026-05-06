import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { analyzeFoodImage } from '@/lib/gemini';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, imageBase64, mimeType, mealType } = body;

    if (!userId || !imageBase64) {
      return NextResponse.json({ error: 'userId and imageBase64 required' }, { status: 400 });
    }

    const analysis = await analyzeFoodImage(imageBase64, mimeType || 'image/jpeg');

    const meal = await prisma.meal.create({
      data: {
        userId,
        name: analysis.name || 'Analyzed Meal',
        description: analysis.description || '',
        mealType: mealType || analysis.mealType || 'snack',
        imageData: imageBase64.substring(0, 500),
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

    return NextResponse.json({ meal, analysis }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
