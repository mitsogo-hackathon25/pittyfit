import { Link } from 'react-router-dom';

const POSTS = [
  {
    id: 1,
    title: '5 Morning Habits of Elite Athletes',
    excerpt: 'Discover the daily rituals that separate champions from the rest. Start your day with purpose.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
    date: 'Sep 15, 2025',
  },
  {
    id: 2,
    title: 'The Science Behind Recovery',
    excerpt: 'Why rest days are just as important as training days — and how to optimize your recovery.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
    date: 'Sep 8, 2025',
  },
  {
    id: 3,
    title: 'Building Mental Toughness',
    excerpt: 'Your mind is your most powerful muscle. Learn strategies to push through when it gets hard.',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=400&fit=crop',
    date: 'Aug 28, 2025',
  },
];

export default function Journal() {
  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-3">Journal</p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            Train Your Mind
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <article key={post.id} className="group">
              <div className="aspect-[3/2] overflow-hidden mb-4 bg-pitty-gray">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="text-xs text-white/40 mb-2">{post.date}</p>
              <h2 className="text-lg font-bold uppercase tracking-tight mb-2 group-hover:text-white/70 transition-colors">
                <Link to="#">{post.title}</Link>
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
