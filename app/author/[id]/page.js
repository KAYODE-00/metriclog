import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PostCard from '@/components/PostCard';

export const dynamic = 'force-dynamic';

export default async function AuthorPage({ params }) {
  const author = await prisma.user.findUnique({ where: { id: params.id } });
  if (!author) notFound();

  const posts = await prisma.post.findMany({
    where: { authorId: author.id, published: true },
    include: { author: true, tags: true, likes: true, comments: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-10">
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center font-display text-xl text-paper shrink-0"
          style={{ background: author.avatarColor }}
        >
          {author.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">{author.name}</h1>
          {author.bio && <p className="text-sm text-inksoft mt-1">{author.bio}</p>}
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-inksoft">No published entries yet.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
