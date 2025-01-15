import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to clap for an entry.' }, { status: 401 });
  }

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId: params.id, userId: session.user.id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  }

  await prisma.like.create({ data: { postId: params.id, userId: session.user.id } });
  return NextResponse.json({ liked: true });
}
