'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

export default function EditPostForm({ post }) {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSave(values) {
    setError('');
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return <PostEditor initial={post} onSave={handleSave} error={error} />;
}
