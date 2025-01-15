import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import LandingPage from '@/components/LandingPage';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession();

  // Show landing page for unauthenticated users
  if (!session) {
    return <LandingPage />;
  }

  // Show feed for authenticated users
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true, tags: true, likes: true, comments: true },
    orderBy: { createdAt: 'desc' },
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-24 text-inksoft">
        <h2 className="font-display text-2xl text-ink mb-2">No entries yet</h2>
        <p>Be the first to publish something measured.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
