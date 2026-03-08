'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';

/**
 * Signup page — creates account via Supabase Auth and user profile in public.users.
 */
export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate username
    if (username.length < 3) {
      setError('Username must be at least 3 characters.');
      setLoading(false);
      return;
    }

    // Sign up with Supabase auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Create user profile in public.users
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        username,
      });

      if (profileError) {
        // Username might already be taken
        setError(profileError.message.includes('duplicate')
          ? 'Username is already taken.'
          : profileError.message);
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setLoading(false);

    // Some Supabase projects require email confirmation
    // If the user is immediately authenticated, redirect
    if (data.session) {
      router.push('/dashboard');
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
          <p className="text-muted mb-6">
            Check your email for a confirmation link, then{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              log in
            </Link>{' '}
            to start studying.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏯</div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted text-sm mt-1">Start your Japanese learning journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="bg-surface rounded-2xl border border-border p-8 space-y-5">
          {error && (
            <div className="bg-danger/10 text-danger text-sm px-4 py-3 rounded-lg border border-danger/20">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-alt border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              placeholder="your_username"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-surface-alt border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-alt border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              placeholder="••••••••"
            />
            <p className="text-xs text-muted mt-1">Minimum 6 characters</p>
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
