import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(identifier, password);
      if (!user.is_staff) {
        logout();
        setError('This account does not have admin access.');
        return;
      }
    } catch {
      setError('Invalid email/username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <p className="text-xs tracking-[0.2em] uppercase text-pitty-gold text-center mb-2">
          Staff only
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-white/50 text-center mb-10 text-sm">
          Sign in with your admin account to manage products
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              Email or username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" variant="solid" disabled={loading} className="w-full justify-center">
            {loading ? 'Signing in...' : 'Sign In to Admin →'}
          </Button>
        </form>

        <p className="text-center text-sm text-white/50 mt-8">
          <Link to="/" className="text-white hover:underline">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
