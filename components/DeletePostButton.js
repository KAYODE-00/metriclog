'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletePostButton({ postId }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button onClick={handleClick} className={confirming ? 'text-danger' : 'hover:text-danger'}>
      {confirming ? 'Confirm delete' : 'Delete'}
    </button>
  );
}
