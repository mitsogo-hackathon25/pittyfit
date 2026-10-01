import { useAuth } from '../context/AuthContext';
import AdminLogin from '../pages/AdminLogin';
import Button from './Button';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return (
      <div className="py-16 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-black uppercase tracking-tight mb-3">Access Denied</h1>
          <p className="text-white/60 text-sm mb-8">
            Your account does not have permission to access the admin panel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={logout} variant="ghost">
              Sign Out
            </Button>
            <Button to="/" variant="solid">
              Back to Store
            </Button>
          </div>
          <p className="text-sm text-white/50 mt-8">
            <button
              type="button"
              onClick={logout}
              className="text-white hover:underline"
            >
              Try a different admin account
            </button>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
