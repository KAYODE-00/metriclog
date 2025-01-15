'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong.');
      setLoading(false);
      return;
    }

    const signInRes = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push('/login');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="font-display text-2xl font-semibold mb-6">Sign up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-inksoft mb-1">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-hairline rounded-sm px-3 py-2 bg-transparent focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-inksoft mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-hairline rounded-sm px-3 py-2 bg-transparent focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-inksoft mb-1">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-hairline rounded-sm px-3 py-2 bg-transparent focus:outline-none focus:border-accent"
          />
          <p className="text-xs text-inksoft mt-1">At least 8 characters.</p>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper rounded-sm px-4 py-2 hover:bg-accent disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="text-sm text-inksoft mt-6">
        Already have an account? <Link href="/login" className="text-accent underline">Log in</Link>
      </p>
    </div>
  );
}
