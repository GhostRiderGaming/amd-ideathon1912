import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { chatWithNutritionist } from '@/lib/gemini';
import { calculateDailyTotals } from '@/lib/nutrition';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, message, conversationId } = body;

    if (!userId || !message) {
      return NextResponse.json({ error: 'userId and message required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayMeals = await prisma.meal.findMany({
      where: { userId, loggedAt: { gte: today, lte: todayEnd } },
    });
    const totals = calculateDailyTotals(todayMeals);

    const userContext = {
      name: user?.name,
      goal: user?.goal,
      restrictions: user?.dietaryRestrictions,
      allergies: user?.allergies,
      targets: {
        calories: user?.dailyCalorieTarget,
        protein: user?.dailyProteinTarget,
        carbs: user?.dailyCarbTarget,
        fat: user?.dailyFatTarget,
      },
      todayIntake: totals,
      todayMeals: todayMeals.map(m => ({ name: m.name, type: m.mealType, calories: m.calories })),
      currentTime: new Date().toLocaleTimeString(),
    };

    let convo;
    if (conversationId) {
      convo = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    if (!convo) {
      convo = await prisma.conversation.create({
        data: { userId },
        include: { messages: true },
      });
    }

    await prisma.message.create({
      data: { conversationId: convo.id, role: 'user', content: message },
    });

    const allMessages = [
      ...convo.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const reply = await chatWithNutritionist(allMessages, userContext);

    await prisma.message.create({
      data: { conversationId: convo.id, role: 'assistant', content: reply },
    });

    return NextResponse.json({
      conversationId: convo.id,
      reply,
    });
  } catch (error) {
    console.error('[API Chat Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
