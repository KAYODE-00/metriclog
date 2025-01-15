import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';

export const dynamic = 'force-dynamic';

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
function readMins(words) {
  return Math.max(1, Math.round(words / 200));
}

export async function generateMetadata({ params }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return {
    title: `${post.title} — metric`,
    description: post.excerpt || post.content.slice(0, 160),
  };
}

export default async function PostPage({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      tags: true,
      likes: true,
      comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
    },
  });

  if (!post || !post.published) notFound();

  const words = wordCount(post.content);
  const mins = readMins(words);

  return (
    <article className="py-10">
      <h1 className="font-display text-4xl font-semibold tracking-tight mb-3">{post.title}</h1>
      <div className="text-xs font-mono text-inksoft flex flex-wrap justify-between gap-2 mb-6">
        <span>
          <Link href={`/author/${post.author.id}`} className="hover:text-accent">{post.author.name}</Link>
          {' · '}
          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span>{words} words · {mins} min read</span>
      </div>

      <div className="prose prose-neutral font-sans text-[17px] leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.name}`}
              className="text-xs font-mono bg-accentsoft text-accent px-2 py-0.5 rounded-sm hover:opacity-80"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      <LikeButton postId={post.id} initialLikes={post.likes.length} />
      <CommentSection postId={post.id} initialComments={post.comments} />
    </article>
  );
}
