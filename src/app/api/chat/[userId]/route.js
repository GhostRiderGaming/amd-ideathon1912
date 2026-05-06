import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { userId } = await params;
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    return NextResponse.json(conversations[0] || null);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
