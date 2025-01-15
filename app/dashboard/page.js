import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeletePostButton from '@/components/DeletePostButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    include: { tags: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold">Your entries</h1>
        <Link href="/dashboard/new" className="bg-ink text-paper rounded-sm px-4 py-2 text-sm hover:bg-accent">
          Write new entry
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-inksoft">Nothing published yet. Start measuring something.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-hairline rounded-sm p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-display font-medium">{post.title}</p>
                <p className="text-xs font-mono text-inksoft mt-1">
                  {post.published ? 'Published' : 'Draft'}
                  {' · '}
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                {post.published && (
                  <Link href={`/post/${post.slug}`} className="hover:text-accent">View</Link>
                )}
                <Link href={`/dashboard/edit/${post.id}`} className="hover:text-accent">Edit</Link>
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
