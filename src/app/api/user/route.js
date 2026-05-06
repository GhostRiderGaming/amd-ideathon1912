import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, age, weightKg, heightCm, activityLevel, goal,
            dietaryRestrictions, allergies, dailyCalorieTarget,
            dailyProteinTarget, dailyCarbTarget, dailyFatTarget } = body;

    if (id) {
      const user = await prisma.user.upsert({
        where: { id },
        update: {
          name, age, weightKg, heightCm, activityLevel, goal,
          dietaryRestrictions: dietaryRestrictions || '[]',
          allergies: allergies || '[]',
          dailyCalorieTarget: dailyCalorieTarget || 2000,
          dailyProteinTarget: dailyProteinTarget || 50,
          dailyCarbTarget: dailyCarbTarget || 250,
          dailyFatTarget: dailyFatTarget || 65,
        },
        create: {
          id, name: name || 'User', age, weightKg, heightCm,
          activityLevel: activityLevel || 'moderate',
          goal: goal || 'maintain',
          dietaryRestrictions: dietaryRestrictions || '[]',
          allergies: allergies || '[]',
          dailyCalorieTarget: dailyCalorieTarget || 2000,
          dailyProteinTarget: dailyProteinTarget || 50,
          dailyCarbTarget: dailyCarbTarget || 250,
          dailyFatTarget: dailyFatTarget || 65,
        },
      });
      return NextResponse.json(user);
    }

    const user = await prisma.user.create({
      data: {
        name: name || 'User',
        age, weightKg, heightCm,
        activityLevel: activityLevel || 'moderate',
        goal: goal || 'maintain',
        dietaryRestrictions: dietaryRestrictions || '[]',
        allergies: allergies || '[]',
        dailyCalorieTarget: dailyCalorieTarget || 2000,
        dailyProteinTarget: dailyProteinTarget || 50,
        dailyCarbTarget: dailyCarbTarget || 250,
        dailyFatTarget: dailyFatTarget || 65,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
