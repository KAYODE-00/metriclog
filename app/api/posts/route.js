import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');
  const q = searchParams.get('q');

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(tag ? { tags: { some: { name: tag } } } : {}),
      ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
    },
    include: { author: true, tags: true, likes: true, comments: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(posts);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to publish.' }, { status: 401 });
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.isAdmin) {
    return NextResponse.json({ error: 'Only admins can publish posts.' }, { status: 403 });
  }

  const { title, excerpt, content, coverImage, published, tags } = await req.json();

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
  }

  const baseSlug = slugify(title) || 'entry';
  let slug = baseSlug;
  let count = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`;
  }

  const tagNames = (tags || '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || content.trim().slice(0, 160),
      content,
      coverImage: coverImage || null,
      published: !!published,
      authorId: session.user.id,
      tags: {
        connectOrCreate: tagNames.map((name) => ({ where: { name }, create: { name } })),
      },
    },
  });

  return NextResponse.json(post);
}
