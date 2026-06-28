import { Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-clay px-6">
      <div className="text-center">
        <h1 className="font-display text-6xl text-ruby mb-4">404</h1>
        <p className="font-body text-ink/60 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link
          to="/"
          className="inline-block font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
