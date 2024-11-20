'use client'
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithGoogle, logout } from '../lib/auth';
import { auth } from '../lib/firebase';
import Link from 'next/link';

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Wishlist Aggregator</h1>
          {!user ? (
            <div className="flex gap-4">
              <button
                onClick={signInWithGoogle}
                className="btn btn-primary btn-outline"
              >
                Google Login
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.displayName || user.email}!
              </span>
              <button onClick={logout} className="btn btn-error btn-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Your Hub for Wishlist Aggregation
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Explore, upvote, and add your most-wanted extensions for platforms like
            Webflow, Shopify, Azure, and more!
          </p>
          {!user ? (
            <div className="flex justify-center gap-4">
              <button
                onClick={signInWithGoogle}
                className="btn btn-primary btn-lg"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <Link href="/wishlist" className="btn btn-accent btn-lg">
                Start Browsing Wishlists
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Wishlist Aggregator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
