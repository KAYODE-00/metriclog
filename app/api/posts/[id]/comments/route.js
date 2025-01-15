import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    include: { author: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(comments);
}

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to comment.' }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: 'Comment cannot be empty.' }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: { content: content.trim(), postId: params.id, authorId: session.user.id },
    include: { author: true },
  });

  return NextResponse.json(comment);
}
