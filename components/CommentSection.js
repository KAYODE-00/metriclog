import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import LandingPage from "@/components/LandingPage";

export const dynamic = "force-dynamic";


export default async function HomePage() {
  const session = await getServerSession();

  // Show landing page for unauthenticated users
  if (!session) {
    return <LandingPage />;
  }

  // Show feed for authenticated users
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
      tags: true,
      likes: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            Community Feed
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight">
            Discover thoughtful writing.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            Explore articles, tutorials, engineering insights, and stories from
            creators around the world.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="max-w-md rounded-3xl border border-border/60 bg-card/70 p-10 text-center shadow-xl backdrop-blur">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                📝
              </div>

              <h2 className="text-2xl font-semibold">
                Nothing published yet
              </h2>

              <p className="mt-3 text-muted-foreground">
                The feed is empty right now. Once someone publishes a post,
                it'll appear here.
              </p>
            </div>
          </div>
        ) : (
          <section className="space-y-6">
            {posts.map((post) => (
            <motion.div
  key={post.id}
  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  }}
  whileHover={{
    y: -6,
    scale: 1.01,
  }}
>
                <PostCard post={post} />
              </motion.div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}