import Button from '../components/Button';

const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop';

export default function About() {
  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">Our Story</p>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">
              Built by Women,<br />For Women
            </h1>
            <p className="text-white/60 leading-relaxed mb-6">
              PITTY FIT was born in the gym — forged through sweat, discipline, and an
              unwavering commitment to excellence. We believe that what you wear should
              match the intensity you bring to every workout.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              Our mission is simple: create premium activewear that empowers women to
              show up, push harder, and become the strongest version of themselves.
              Discipline and consistency aren&apos;t just our tagline — they&apos;re our way of life.
            </p>
            <Button to="/shop" variant="ghost">Shop Now →</Button>
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={ABOUT_IMAGE}
              alt="Gym training"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { number: '10K+', label: 'Happy Customers' },
            { number: '50+', label: 'Products' },
            { number: '100%', label: 'Women Owned' },
          ].map((stat) => (
            <div key={stat.label} className="border border-white/10 py-10 px-6">
              <p className="text-4xl font-black mb-2">{stat.number}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
