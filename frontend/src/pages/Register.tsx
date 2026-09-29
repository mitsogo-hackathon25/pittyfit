import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/account');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-center">Register</h1>
        <p className="text-white/50 text-center mb-10 text-sm">
          Join the Pitty Fit crew
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
                First Name
              </label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
                Last Name
              </label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
              Confirm Password
            </label>
            <input
              name="password_confirm"
              type="password"
              value={form.password_confirm}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" variant="solid" disabled={loading} className="w-full justify-center">
            {loading ? 'Creating account...' : 'Create Account →'}
          </Button>
        </form>

        <p className="text-center text-sm text-white/50 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
