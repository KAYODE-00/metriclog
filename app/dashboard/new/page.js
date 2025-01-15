'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostEditor from '@/components/PostEditor';

export default function NewPostPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSave(values) {
    setError('');
    const res = await fetch('/api/posts', {
      method: 'POST',
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

  return (
    <div className="py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">New entry</h1>
      <PostEditor onSave={handleSave} error={error} />
    </div>
  );
}
