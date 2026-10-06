import { useState } from 'react';
import { subscribeNewsletter } from '../api/endpoints';

export default function NewsletterSection() {
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
    <section className="bg-black py-12 sm:py-16 px-6 text-center border-t border-white/10">
      <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.04em] mb-3">
        Join the Pitty Fit Crew
      </h2>
      <p className="text-[12px] sm:text-sm text-white/50 mb-8 max-w-xs mx-auto leading-relaxed">
        Get exclusive drops, fitness tips, and special offers.
      </p>

      <form onSubmit={handleSubscribe} className="flex max-w-md mx-auto border border-white/20">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-1 bg-white px-4 py-3 text-sm text-black placeholder-black/40 outline-none min-w-0"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 bg-black text-white hover:bg-white/10 transition-colors border-l border-white/20 flex-shrink-0"
        >
          →
        </button>
      </form>

      {message && (
        <p className="text-xs text-pitty-gold mt-3">{message}</p>
      )}
    </section>
  );
}
