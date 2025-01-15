import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are all required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const colors = ['#2D5F5A', '#A3402F', '#3D5A80', '#8A5A44', '#5B4B8A'];
  const avatarColor = colors[Math.floor(Math.random() * colors.length)];

  const user = await prisma.user.create({
    data: { name: name.trim(), email: normalizedEmail, passwordHash, avatarColor },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
