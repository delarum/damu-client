import { Link } from "react-router-dom";
import BloodFlow from "../components/BloodFlow";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6 relative z-10">
        <span className="font-display text-lg tracking-tight text-ruby">DamuLink</span>
        <nav className="flex items-center gap-6">
          <Link
            to="/login"
            className="font-body text-sm font-medium text-ink/70 hover:text-ruby transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="font-body text-sm font-semibold px-4 py-2 rounded-full bg-ruby text-white hover:bg-ruby-deep transition-colors"
          >
            Become a donor
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center min-h-[600px]">
        <BloodFlow className="absolute inset-0 h-full opacity-90" />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ruby/70 mb-5">
            Kenya's donor network
          </p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-ink mb-6">
            ONE DROP
            <br />
            <span className="text-ruby">REACHES FAR</span>
          </h1>
          <p className="font-body text-base md:text-lg text-ink/70 max-w-xl mx-auto mb-10 leading-relaxed">
            DamuLink connects verified blood and organ donors with hospitals across
            the country — so when someone needs help, the right person isn't far away.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="font-body text-sm font-semibold px-7 py-3.5 rounded-full bg-ruby text-white hover:bg-ruby-deep transition-colors shadow-[0_8px_24px_-8px_rgba(87,3,0,0.5)]"
            >
              Register as a donor
            </Link>
            <Link
              to="/login"
              className="font-body text-sm font-semibold px-7 py-3.5 rounded-full border border-ink/15 text-ink hover:border-ruby/40 hover:text-ruby transition-colors"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Quiet stats strip — no animation, just facts */}
      <section className="border-t border-ink/10 px-6 md:px-12 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="font-display text-2xl md:text-3xl text-ruby">8</p>
            <p className="font-mono text-xs uppercase tracking-wide text-ink/50 mt-1">
              Blood types matched
            </p>
          </div>
          <div>
            <p className="font-display text-2xl md:text-3xl text-ruby">24/7</p>
            <p className="font-mono text-xs uppercase tracking-wide text-ink/50 mt-1">
              Urgent request alerts
            </p>
          </div>
          <div>
            <p className="font-display text-2xl md:text-3xl text-ruby">USSD</p>
            <p className="font-mono text-xs uppercase tracking-wide text-ink/50 mt-1">
              Works without internet
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}