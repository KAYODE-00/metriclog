'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="17" y1="11" x2="23" y2="11" />
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <path d="M12 2v4m0 12v4M4.22 4.22l2.83 2.83m8.9 8.9l2.83 2.83M2 12h4m12 0h4M4.22 19.78l2.83-2.83m8.9-8.9l2.83-2.83" />
    </svg>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  function validatePasswords() {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordsMatch(false);
      return false;
    }
    setPasswordsMatch(true);
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!validatePasswords()) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    const signInRes = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      router.push('/login');
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
            Join our community
          </h1>
          <p className="text-inksoft">Create an account to start writing today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-mono text-inksoft mb-2 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full border border-hairline rounded-sm px-4 py-2.5 bg-transparent font-sans text-ink focus:outline-none focus:border-accent focus:ring-1 focus:ring-accentsoft"
            />
          </div>

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
            <p className="text-xs text-inksoft mt-1">At least 8 characters</p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-mono text-inksoft mb-2 uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validatePasswords();
              }}
              placeholder="••••••••"
              className={`w-full border rounded-sm px-4 py-2.5 bg-transparent font-sans text-ink focus:outline-none focus:ring-1 ${
                !passwordsMatch
                  ? 'border-danger focus:border-danger focus:ring-red-200'
                  : 'border-hairline focus:border-accent focus:ring-accentsoft'
              }`}
            />
            {!passwordsMatch && (
              <p className="text-xs text-danger mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 p-3 bg-red-50 border border-danger rounded-sm">
              <AlertIcon />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className="w-full bg-accent text-paper py-2.5 rounded-sm font-semibold hover:bg-ink transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <SpinIcon />
                Creating account...
              </>
            ) : (
              <>
                <UserPlusIcon />
                Create Account
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

        {/* Sign In Link */}
        <p className="text-center text-sm text-inksoft">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
