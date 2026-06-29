import { Navigate } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { useLanguage } from "../lib/LanguageContext";

export default function HospitalProtectedRoute({ children }) {
  const { user, loading } = useHospitalAuth();
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

  return children;
}
