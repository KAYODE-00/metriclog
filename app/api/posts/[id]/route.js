import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { author: true, tags: true },
  });
  if (!post) return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
  if (post.authorId !== session.user.id) {
    return NextResponse.json({ error: 'You can only edit your own entries.' }, { status: 403 });
  }

  const { title, excerpt, content, coverImage, published, tags } = await req.json();

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
  }

  const tagNames = (tags || '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const updated = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: title.trim(),
      excerpt: excerpt?.trim() || content.trim().slice(0, 160),
      content,
      coverImage: coverImage || null,
      published: !!published,
      tags: {
        set: [],
        connectOrCreate: tagNames.map((name) => ({ where: { name }, create: { name } })),
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: 'Entry not found.' }, { status: 404 });
  if (post.authorId !== session.user.id) {
    return NextResponse.json({ error: 'You can only delete your own entries.' }, { status: 403 });
  }

  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
