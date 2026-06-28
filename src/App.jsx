import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import { LanguageProvider } from "./lib/LanguageContext";
import { HospitalAuthProvider } from "./lib/HospitalAuthContext";
import { AdminAuthProvider } from "./lib/AdminAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AccessibilityMenu from "./components/AccessibilityMenu";

import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ContactRequests from "./pages/ContactRequests";
import DonationHistory from "./pages/DonationHistory";
import Credits from "./pages/Credits";
import Badges from "./pages/Badges";
import Verification from "./pages/Verification";
import ThirdPartyApply from "./pages/ThirdPartyApply";

import HospitalLogin from "./pages/HospitalLogin";
import HospitalRegister from "./pages/HospitalRegister";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalSearch from "./pages/HospitalSearch";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalStaff from "./pages/HospitalStaff";
import HospitalSubscription from "./pages/HospitalSubscription";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHospitals from "./pages/AdminHospitals";
import AdminAuditLogs from "./pages/AdminAuditLogs";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/requests" element={<ProtectedRoute><ContactRequests /></ProtectedRoute>} />
            <Route path="/donations" element={<ProtectedRoute><DonationHistory /></ProtectedRoute>} />
            <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
            <Route path="/badges" element={<ProtectedRoute><Badges /></ProtectedRoute>} />
            <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
            <Route path="/third-party/apply" element={<ProtectedRoute><ThirdPartyApply /></ProtectedRoute>} />

            <Route path="/hospital/login" element={<HospitalAuthProvider><HospitalLogin /></HospitalAuthProvider>} />
            <Route path="/hospital/register" element={<HospitalAuthProvider><HospitalRegister /></HospitalAuthProvider>} />
            <Route path="/hospital/dashboard" element={<HospitalAuthProvider><ProtectedRoute><HospitalDashboard /></ProtectedRoute></HospitalAuthProvider>} />
            <Route path="/hospital/search" element={<HospitalAuthProvider><ProtectedRoute><HospitalSearch /></ProtectedRoute></HospitalAuthProvider>} />
            <Route path="/hospital/profile" element={<HospitalAuthProvider><ProtectedRoute><HospitalProfile /></ProtectedRoute></HospitalAuthProvider>} />
            <Route path="/hospital/staff" element={<HospitalAuthProvider><ProtectedRoute><HospitalStaff /></ProtectedRoute></HospitalAuthProvider>} />
            <Route path="/hospital/subscription" element={<HospitalAuthProvider><ProtectedRoute><HospitalSubscription /></ProtectedRoute></HospitalAuthProvider>} />

            <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
            <Route path="/admin/dashboard" element={<AdminAuthProvider><ProtectedRoute><AdminDashboard /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/hospitals" element={<AdminAuthProvider><ProtectedRoute><AdminHospitals /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/audit-logs" element={<AdminAuthProvider><ProtectedRoute><AdminAuditLogs /></ProtectedRoute></AdminAuthProvider>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          <AccessibilityMenu />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
