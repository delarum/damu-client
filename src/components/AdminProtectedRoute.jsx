import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../lib/AdminAuthContext";
import { useLanguage } from "../lib/LanguageContext";

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAdminAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-body text-sm text-ink/50">{t("common.loading")}</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
