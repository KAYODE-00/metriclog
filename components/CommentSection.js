'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CommentSection({ postId, initialComments }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      return;
    }
    setComments((prev) => [...prev, data]);
    setText('');
  }

  return (
    <div className="mt-12 border-t border-hairline pt-8">
      <h3 className="font-display text-lg mb-4">
        {comments.length} comment{comments.length === 1 ? '' : 's'}
      </h3>

      {session ? (
        <form onSubmit={submit} className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add to the conversation"
            className="w-full border border-hairline rounded-sm p-3 text-sm min-h-[80px] bg-transparent focus:outline-none focus:border-accent"
          />
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-ink text-paper rounded-sm px-4 py-2 text-sm hover:bg-accent disabled:opacity-50"
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-inksoft mb-8">
          <Link href="/login" className="text-accent underline">Log in</Link> to join the conversation.
        </p>
      )}

      <div className="space-y-5">
        {comments.map((c) => (
          <div key={c.id} className="text-sm">
            <div className="font-mono text-xs text-inksoft mb-1">
              <Link href={`/author/${c.author.id}`} className="hover:text-accent">{c.author.name}</Link>
              {' · '}
              {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <p className="whitespace-pre-wrap">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
