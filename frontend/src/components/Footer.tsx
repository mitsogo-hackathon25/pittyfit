import { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../api/endpoints';
import Logo from './Logo';

const FOOTER_LINKS = [
  { label: 'SHOP', to: '/shop' },
  { label: 'ABOUT', to: '/about' },
  { label: 'JOURNAL', to: '/journal' },
  { label: 'CONTACT', to: '/contact' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'Pinterest', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      setMessage('Welcome to the crew!');
      setEmail('');
    } catch {
      setMessage('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0a0a0a]">
      <div className="px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Logo size="md" />
          </div>

          {/* Nav + Social */}
          <div className="flex flex-col items-center gap-6">
            <nav className="flex flex-wrap justify-center gap-6 sm:gap-8">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[10px] tracking-[0.2em] uppercase text-white/55 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-white/45 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <SocialIcon name={social.label} />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-center md:items-end">
            <p className="text-[10px] tracking-[0.18em] uppercase text-white/55 mb-4 text-center md:text-right">
              Join the Pitty Fit Crew
            </p>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-xs border border-white/20">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 text-white hover:bg-white/10 transition-colors border-l border-white/20"
              >
                →
              </button>
            </form>
            {message && (
              <p className="text-xs text-pitty-gold mt-2">{message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/35 tracking-wide">
            © 2025 PITTY FIT. All rights reserved.
          </p>
          <div className="flex gap-4 text-[10px] tracking-[0.18em] uppercase text-white/35">
            <span>Discipline</span>
            <span>/</span>
            <span>Consistency</span>
            <span>/</span>
            <span>Results</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const size = 18;
  switch (name) {
    case 'Instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'TikTok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
        </svg>
      );
    case 'Facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'YouTube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'Pinterest':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.17-.1-.95-.19-2.4.04-3.44.21-.91 1.36-5.81 1.36-5.81s-.35-.7-.35-1.73c0-1.62.94-2.83 2.11-2.83.99 0 1.47.75 1.47 1.64 0 1-.64 2.5-.97 3.89-.28 1.16.58 2.11 1.73 2.11 2.08 0 3.67-2.19 3.67-5.35 0-2.79-2-4.74-4.86-4.74-3.31 0-5.26 2.48-5.26 5.04 0 1 .39 2.08.87 2.67a.35.35 0 0 1 .08.33c-.09.38-.29 1.18-.33 1.34-.05.22-.17.27-.39.16-1.46-.68-2.37-2.81-2.37-4.54 0-3.7 2.69-7.1 7.76-7.1 4.08 0 7.25 2.91 7.25 6.8 0 4.05-2.55 7.31-6.09 7.31-1.19 0-2.31-.62-2.69-1.35l-.73 2.79c-.26 1.01-.97 2.27-1.45 3.04 1.09.34 2.25.52 3.45.52 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
        </svg>
      );
    default:
      return null;
  }
}
