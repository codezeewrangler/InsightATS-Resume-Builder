import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ApiError } from '@/lib/apiClient';

interface ProfilePageProps {
  darkMode?: boolean;
}

export function ProfilePage({ darkMode }: ProfilePageProps) {
  const { user, status, login, register, logout } = useAuthStore();
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = status === 'loading';

  const getErrorMessage = (err: unknown) => {
    if (err instanceof ApiError) {
      return err.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Authentication failed. Please try again.';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();

    try {
      if (isSignInMode) {
        await login(normalizedEmail, password);
      } else {
        await register(normalizedEmail, password, normalizedName || undefined);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (user) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
          <p className="text-sm text-slate-600">Manage your account and access settings.</p>
        </div>

        <div
          className={`rounded-2xl border p-6 shadow-lg ${
            darkMode
              ? 'border-slate-700 bg-slate-900 text-slate-100'
              : 'border-slate-200 bg-white text-slate-900'
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">Signed in as</p>
              <p className="text-xl font-semibold">{user.fullName ?? user.email}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => logout()}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md rounded-3xl border p-8 shadow-xl ${
          darkMode
            ? 'border-slate-700 bg-slate-900 text-slate-100'
            : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <h2 className="text-2xl font-bold">{isSignInMode ? 'Sign In' : 'Create Account'}</h2>
        <p className="text-sm text-slate-500">
          {isSignInMode
            ? 'Access your resume workspace'
            : 'Start collaborating on resumes in real time'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isSignInMode && (
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <User className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                className="w-full bg-transparent text-sm outline-none"
                placeholder="jane@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                className="w-full bg-transparent text-sm outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {isSignInMode ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {isSubmitting ? 'Please wait…' : isSignInMode ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => setIsSignInMode(!isSignInMode)}
          className="mt-4 text-sm text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          {isSignInMode ? 'Need an account? Sign up.' : 'Already have an account? Sign in.'}
        </button>
      </motion.div>
    </div>
  );
}
