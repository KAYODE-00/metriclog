'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, AlertCircle, Loader } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Incorrect email or password.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="font-display text-3xl font-bold text-ink">
              metric
              <span className="inline-block w-2 h-2 rounded-full bg-accent ml-2 -translate-y-1" />
            </span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            Welcome back
          </h1>
          <p className="text-inksoft">Sign in to your account to continue writing</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-mono text-inksoft mb-2 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-hairline rounded-sm px-4 py-2.5 bg-transparent font-sans text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accentsoft"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-mono text-inksoft mb-2 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-hairline rounded-sm px-4 py-2.5 bg-transparent font-sans text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accentsoft"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 p-3 bg-red-50 border border-danger rounded-sm">
              <AlertCircle size={18} className="text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-paper py-2.5 rounded-sm font-semibold hover:bg-ink transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-hairline" />
          <span className="text-xs text-inksoft font-mono">or</span>
          <div className="flex-1 border-t border-hairline" />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-inksoft">
          Don't have an account?{' '}
          <Link href="/signup" className="text-accent font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
