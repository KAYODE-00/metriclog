'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LikeButton({ postId, initialLikes }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (!session) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      setLikes((prev) => prev + (data.liked ? 1 : -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className="mt-8 border border-hairline rounded-sm px-4 py-2 text-sm hover:border-accent flex items-center gap-2 disabled:opacity-50"
    >
      👏 {likes} clap{likes === 1 ? '' : 's'}
    </button>
  );
}
