import { prisma } from '@/lib/prisma';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }) {
  const q = searchParams.q || '';

  const posts = q
    ? await prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: { author: true, tags: true, likes: true, comments: true },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  return (
    <div className="py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">Results for &ldquo;{q}&rdquo;</h1>
      {posts.length === 0 ? (
        <p className="text-inksoft">No entries matched.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
