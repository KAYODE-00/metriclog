import { prisma } from '@/lib/prisma';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default async function TagPage({ params }) {
  const posts = await prisma.post.findMany({
    where: { published: true, tags: { some: { name: params.tag } } },
    include: { author: true, tags: true, likes: true, comments: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">#{params.tag}</h1>
      {posts.length === 0 ? (
        <p className="text-inksoft">No entries with this tag yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
