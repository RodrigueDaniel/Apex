"use client";
import React, { useState } from 'react';
import { signUp, signIn } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    
    await signUp.email({
      email,
      password,
      name: username,
      callbackURL: "/",
    }, {
        onSuccess: () => {
            router.push("/");
        },
        onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
        }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="w-full max-w-md p-8 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm mt-2">Join Apex Trading today</p>
        </div>
        
        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
                {error}
            </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
              placeholder="TraderJoe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
              placeholder="joe@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
              placeholder="••••••••"
            />
          </div>

          {/* Primary Purple Button */}
          <button 
            onClick={handleSignUp}
            disabled={loading || !email || !password || !username}
            className="w-full py-3 mt-4 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Google Button (White/Purple Theme) */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 mb-6 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-semibold transition flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="mt-6 text-center pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}