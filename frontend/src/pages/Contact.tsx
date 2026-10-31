import { useState } from 'react';
import Button from '../components/Button';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`PITTY FIT contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:donald@pitty.fit?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-3">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Get in Touch
          </h1>
          <p className="text-white/50 mt-4 text-sm">
            Have a question? We&apos;d love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-12 border border-white/10">
            <p className="text-pitty-gold mb-2">Message sent!</p>
            <p className="text-white/50 text-sm">We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors"
              />
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
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-white outline-none focus:border-white transition-colors resize-none"
              />
            </div>
            <Button type="submit" variant="solid" className="w-full justify-center">
              Send Message →
            </Button>
          </form>
        )}

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center sm:text-left max-w-md mx-auto sm:mx-0">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-white/40 mb-2">Email</p>
            <p className="text-sm">donald@pitty.fit</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-white/40 mb-2">Phone</p>
            <a
              href="tel:+12395225528"
              className="text-sm hover:text-pitty-gold transition-colors"
            >
              +1 (239) 522-5528
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
