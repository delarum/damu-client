import { Navigate } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { useLanguage } from "../lib/LanguageContext";

export default function HospitalProtectedRoute({ children }) {
  const { user, hospitalProfile, loading } = useHospitalAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-body text-sm text-ink/50">{t("common.loading")}</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/hospital/login" replace />;
  }

  // Check if hospital is approved
  if (!hospitalProfile?.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clay">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="w-16 h-16 rounded-full bg-ruby/10 flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                stroke="#570300"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-display font-medium text-2xl text-ink mb-2">Account Pending Approval</h1>
          <p className="font-body text-sm text-ink/55 mb-6">
            Your hospital registration is under review. You'll receive an email once approved.
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="font-body text-sm font-semibold px-6 py-3 rounded-full bg-ruby text-cream hover:bg-ruby-deep"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return children;
}
