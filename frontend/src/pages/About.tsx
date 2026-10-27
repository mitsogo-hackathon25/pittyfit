import type { ReactNode } from 'react';
import Button from '../components/Button';

function AboutSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-white/10 pt-12 sm:pt-16 first:border-t-0 first:pt-0">
      <h2 className="text-lg sm:text-xl font-black uppercase tracking-[0.12em] mb-8 sm:mb-10">
        {title}
      </h2>
      <div className="space-y-6 text-white/70 leading-relaxed text-[15px] sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-14 sm:mb-16 text-center sm:text-left">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-4">
            Built for more
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-5">
            Built for More.
          </h1>
          <p className="text-white/60 text-[15px] sm:text-base leading-relaxed">
            Built by gym rats. Made for real life. Driven by purpose.
          </p>
        </header>

        <AboutSection title="Our Story">
          <p>
            We&apos;re not professional athletes, celebrities, or people who have it all figured
            out.{' '}
            <strong className="font-semibold text-white/90">
              We&apos;re normal people who love the gym, believe in hard work, and show up every
              day to become a better version of ourselves.
            </strong>
          </p>
          <p>
            We know what it&apos;s like to push through a tough workout, chase a goal, start over
            after a setback, and keep going even when nobody is watching. Fitness isn&apos;t just
            something we do — it&apos;s part of who we are.
          </p>
          <p>
            That&apos;s why we created <strong className="font-semibold text-white/90">PITTY FIT</strong>.
          </p>
          <p>
            We wanted to build a fitness apparel brand that represents real people and real
            dedication. Clothing that looks great, feels great, and moves with you — whether
            you&apos;re lifting heavy, hitting cardio, or simply working toward becoming stronger,
            inside and out.
          </p>
          <p>You don&apos;t have to be perfect to belong here. You just have to show up.</p>
        </AboutSection>

        <AboutSection title="More Than a Fitness Brand">
          <p>
            At PITTY FIT, we believe strength means more than what you can lift. It&apos;s also
            about having a heart, standing for something, and making a difference wherever you
            can.
          </p>
          <p>
            Animals hold a special place in our hearts. They give unconditional love, trust us to
            protect them, and deserve a chance at a safe and loving life.
          </p>
          <p>
            That&apos;s why{' '}
            <strong className="font-semibold text-white/90">
              10% of our profits will be donated to local animal shelters
            </strong>{' '}
            to help support the animals who need it most.
          </p>
          <p>
            Every purchase helps us grow our brand and contribute to a cause that means something
            to us. When you support PITTY FIT, you&apos;re supporting more than fitness — you&apos;re
            helping us give back.
          </p>
        </AboutSection>

        <AboutSection title="Real People. Real Work. Real Purpose.">
          <p>
            We&apos;re gym rats. We&apos;re animal lovers. We&apos;re everyday people chasing
            something better.
          </p>
          <p>
            We believe in discipline, consistency, and never giving up on yourself — and we believe
            in showing up for the people, animals, and communities we care about.
          </p>
        </AboutSection>

        <section className="border-t border-white/10 pt-12 sm:pt-16 mt-12 sm:mt-16 text-center">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-[0.12em] mb-8">
            Welcome to the PITTY FIT Family.
          </h2>
          <Button to="/shop" variant="ghost">Shop Now →</Button>
        </section>
      </div>
    </div>
  );
}
