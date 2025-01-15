'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [q, setQ] = useState('');
  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="border-b border-hairline">
      <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          metric
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent ml-1 -translate-y-2" />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 min-w-[140px] max-w-xs">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search entries"
            aria-label="Search entries"
            className="w-full text-sm border border-hairline rounded-sm px-3 py-1.5 font-mono bg-transparent focus:outline-none focus:border-accent"
          />
        </form>

        <nav className="flex items-center gap-3 text-sm">
          {status === 'loading' ? null : session ? (
            <>
              <Link href="/dashboard" className="hover:text-accent">Dashboard</Link>
              <Link href={`/author/${session.user.id}`} className="hover:text-accent">Profile</Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="border border-hairline rounded-sm px-3 py-1.5 hover:border-accent"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-accent">Log in</Link>
              <Link href="/signup" className="bg-ink text-paper rounded-sm px-3 py-1.5 hover:bg-accent">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
