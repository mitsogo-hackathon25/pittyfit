import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'HOME', to: '/' },
  { label: 'SHOP', to: '/shop' },
  { label: 'ABOUT', to: '/about' },
  { label: 'JOURNAL', to: '/journal' },
  { label: 'CONTACT', to: '/contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
      {/* Mobile header */}
      <div className="lg:hidden px-4">
        <div className="grid grid-cols-[40px_1fr_auto] items-center h-[64px] gap-2">
          <button
            className="text-white justify-self-start"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="justify-self-center">
            <Logo size="xs" />
          </Link>

          <div className="flex items-center gap-3.5 justify-self-end">
            <button
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search size={17} strokeWidth={1.5} />
            </button>
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Account"
            >
              <User size={17} strokeWidth={1.5} />
            </Link>
            <Link
              to="/cart"
              className="relative text-white/80 hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={17} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 bg-white text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop header — exact original */}
      <div className="hidden lg:block">
        <div className="px-6 lg:px-10">
          <div className="relative flex items-center justify-between h-[72px]">
            <Link to="/" className="flex-shrink-0 z-10">
              <Logo size="sm" />
            </Link>

            <nav className="flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[11px] font-normal tracking-[0.22em] uppercase transition-colors hover:text-white ${
                    location.pathname === link.to ? 'text-white' : 'text-white/75'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-[11px] font-normal tracking-[0.22em] uppercase transition-colors hover:text-white ${
                    location.pathname === '/admin' ? 'text-pitty-gold' : 'text-pitty-gold/80'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-5 z-10">
              <button
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Account"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
              <Link
                to="/cart"
                className="relative text-white/80 hover:text-white transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-black border-t border-white/10">
          <nav className="flex flex-col px-6 py-5 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium tracking-[0.2em] uppercase text-white/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium tracking-[0.2em] uppercase text-pitty-gold hover:text-pitty-gold/80"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
