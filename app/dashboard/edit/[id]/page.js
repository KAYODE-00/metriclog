import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditPostForm from '@/components/EditPostForm';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });
  if (!post) notFound();
  if (post.authorId !== session.user.id) redirect('/dashboard');

  return (
    <div className="py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">Edit entry</h1>
      <EditPostForm post={post} />
    </div>
  );
}
