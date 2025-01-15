import Link from 'next/link';

function excerptText(text, len = 160) {
  const clean = text.replace(/\n+/g, ' ').trim();
  return clean.length > len ? clean.slice(0, len).trim() + '…' : clean;
}
function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
function readMins(words) {
  return Math.max(1, Math.round(words / 200));
}

export default function PostCard({ post }) {
  const words = wordCount(post.content);
  const mins = readMins(words);

  return (
    <article className="border-b border-hairline py-6">
      <Link href={`/post/${post.slug}`}>
        <h2 className="font-display text-xl font-medium hover:text-accent">{post.title}</h2>
      </Link>
      <p className="text-sm text-inksoft mt-2 mb-3 leading-relaxed">
        {post.excerpt || excerptText(post.content)}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-inksoft">
        <span>
          <Link href={`/author/${post.author.id}`} className="hover:text-accent">{post.author.name}</Link>
          {' · '}
          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span>{words} words · {mins} min read · {post.likes.length} claps · {post.comments.length} comments</span>
      </div>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
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
    </article>
  );
}
